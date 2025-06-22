import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/actions/auth.actions";
import voiceDataServiceMongoDB from "@/lib/services/voiceDataServiceMongoDB";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    const { recordingId } = await request.json();
    
    if (!recordingId) {
      return NextResponse.json(
        { success: false, message: "Recording ID is required" },
        { status: 400 }
      );
    }

    console.log(`[Analysis API] Starting analysis for recording: ${recordingId}`);
    
    try {
      // Retrieve the recording from MongoDB
      const { buffer, metadata } = await voiceDataServiceMongoDB.getVoiceRecording(recordingId);
      
      // Verify the recording belongs to the requesting user
      if (metadata.userId !== user.id) {
        return NextResponse.json(
          { success: false, message: "Unauthorized access to recording" },
          { status: 403 }
        );
      }

      console.log(`[Analysis API] Retrieved recording: ${buffer.length} bytes`);
      
      // Send to Python analysis backend with a JSON payload
      const analysisResponse = await fetch('http://127.0.0.1:8000/analyze-audio/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ audio_url: metadata.recordingUrl }),
      });
      
      if (!analysisResponse.ok) {
        const errorText = await analysisResponse.text();
        console.error(`[Analysis API] Python backend error: ${analysisResponse.status} ${errorText}`);
        throw new Error(`Analysis service error: ${analysisResponse.status}`);
      }
      
      const analysisResult = await analysisResponse.json();
      console.log(`[Analysis API] Analysis completed successfully`);
      
      return NextResponse.json({
        success: true,
        analysis: analysisResult,
        metadata: {
          recordingId,
          duration: metadata.metadata.duration,
          fileSize: metadata.metadata.fileSize,
          mimeType: metadata.metadata.mimeType
        }
      });
      
    } catch (mongoError) {
      console.log(`[Analysis API] MongoDB failed, trying Firebase fallback...`);
      
      // Fallback to Firebase (if you have a Firebase service)
      // For now, we'll just return the MongoDB error
      throw mongoError;
    }
    
  } catch (error) {
    console.error("[Analysis API] Error:", error);
    
    let errorMessage = "Failed to analyze recording";
    let statusCode = 500;
    
    if ((error as Error).message.includes('not found')) {
      errorMessage = "Recording not found or has been deleted";
      statusCode = 404;
    } else if ((error as Error).message.includes('Analysis service')) {
      errorMessage = "Analysis service is currently unavailable. Please try again later.";
      statusCode = 503;
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: errorMessage,
        error: (error as Error).message 
      },
      { status: statusCode }
    );
  }
}
