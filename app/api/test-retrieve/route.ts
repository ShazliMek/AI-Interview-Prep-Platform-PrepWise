import { NextResponse } from "next/server";
import voiceDataService from "@/lib/services/voiceDataService";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const recordingId = searchParams.get('id');
    
    if (!recordingId) {
      return NextResponse.json(
        { success: false, message: "Recording ID is required" },
        { status: 400 }
      );
    }
    
    console.log('Retrieving recording:', recordingId);
    
    // Retrieve and decrypt the recording
    const { buffer, metadata } = await voiceDataService.getVoiceRecording(recordingId);
    
    console.log('Retrieved recording:', {
      id: recordingId,
      size: buffer.length,
      metadata: metadata.metadata
    });
    
    // Convert buffer to base64 for JSON response
    const base64Data = buffer.toString('base64');
    
    return NextResponse.json({
      success: true,
      recordingId,
      metadata,
      dataSize: buffer.length,
      // For text files, we can also show the content
      textContent: buffer.toString('utf8'),
      base64Data: base64Data.substring(0, 100) + (base64Data.length > 100 ? '...' : ''),
      message: "Recording retrieved and decrypted successfully"
    });
  } catch (error) {
    console.error("Error retrieving recording:", error);
    return NextResponse.json(
      { success: false, message: "Failed to retrieve recording", error: (error as Error).message },
      { status: 500 }
    );
  }
}
