import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/actions/auth.actions";
import voiceDataService from "@/lib/services/voiceDataService";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id: recordingId } = await params;
    
    console.log(`[Firebase Retrieval API] Getting recording ${recordingId} for user ${user.id}`);
    
    // Retrieve and decrypt the recording using Firebase service
    const { buffer, metadata } = await voiceDataService.getVoiceRecording(recordingId);
    
    // Verify the recording belongs to the requesting user
    if (metadata.userId !== user.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access to recording" },
        { status: 403 }
      );
    }
    
    console.log(`[Firebase Retrieval API] Retrieved recording: ${buffer.length} bytes`);
    
    // Return the audio data as binary response
    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': metadata.metadata.mimeType || 'audio/webm',
        'Content-Length': buffer.length.toString(),
        'Content-Disposition': `inline; filename="recording-${recordingId}.webm"`,
        'Cache-Control': 'private, max-age=3600'
      }
    });
  } catch (error) {
    console.error("Error retrieving recording from Firebase:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to retrieve recording", 
        error: (error as Error).message 
      },
      { status: 500 }
    );
  }
}
