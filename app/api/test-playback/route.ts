import { NextResponse } from "next/server";
import voiceDataServiceMongoDB from "@/lib/services/voiceDataServiceMongoDB";

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
    
    console.log(`[Test Playback API] Testing playback for recording: ${recordingId}`);
    
    // Retrieve and decrypt the recording using MongoDB service
    const { buffer, metadata } = await voiceDataServiceMongoDB.getVoiceRecording(recordingId);
    
    console.log(`[Test Playback API] Retrieved recording: ${buffer.length} bytes, type: ${metadata.metadata.mimeType}`);
    
    // Return the audio data as binary response
    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': metadata.metadata.mimeType || 'audio/webm',
        'Content-Length': buffer.length.toString(),
        'Content-Disposition': `inline; filename="test-recording-${recordingId}.webm"`,
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*', // Allow browser playback
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  } catch (error) {
    console.error("Error in test playback API:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to retrieve recording for playback", 
        error: (error as Error).message 
      },
      { status: 500 }
    );
  }
}
