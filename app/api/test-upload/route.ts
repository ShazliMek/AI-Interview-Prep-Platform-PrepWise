import { NextResponse } from "next/server";
import voiceDataService from "@/lib/services/voiceDataService";

// POST new voice recording (test version without auth)
export async function POST(request: Request) {
  try {
    // Get form data with audio file
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    const interviewId = formData.get('interviewId') as string;
    const metadataStr = formData.get('metadata') as string;
    
    if (!audioFile || !interviewId) {
      return NextResponse.json(
        { success: false, message: "Missing audio file or interview ID" },
        { status: 400 }
      );
    }

    const metadata = metadataStr ? JSON.parse(metadataStr) : {};
    
    // Convert file to buffer for encryption
    const arrayBuffer = await audioFile.arrayBuffer();
    const audioBuffer = Buffer.from(arrayBuffer);
    
    console.log('Processing file upload:', {
      filename: audioFile.name,
      size: audioFile.size,
      type: audioFile.type,
      interviewId
    });
    
    // Store the recording using voice data service
    const recordingId = await voiceDataService.storeVoiceRecording(
      'test-user-upload',
      interviewId,
      audioBuffer,
      {
        duration: metadata.duration || 0,
        fileSize: audioFile.size,
        mimeType: audioFile.type,
        originalFileName: audioFile.name,
        ...metadata
      }
    );
    
    return NextResponse.json({ 
      success: true, 
      recordingId,
      message: "Recording stored successfully",
      fileInfo: {
        name: audioFile.name,
        size: audioFile.size,
        type: audioFile.type
      }
    });
  } catch (error) {
    console.error("Error storing recording:", error);
    return NextResponse.json(
      { success: false, message: "Failed to store recording", error: (error as Error).message },
      { status: 500 }
    );
  }
}
