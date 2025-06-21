import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/actions/auth.actions";
import voiceDataService from "@/lib/services/voiceDataService";

export async function GET(request: Request) {
  try {
    // Get the current user
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Get recording ID from query params
    const { searchParams } = new URL(request.url);
    const recordingId = searchParams.get('id');
    
    if (!recordingId) {
      return NextResponse.json(
        { success: false, message: "Missing recording ID" },
        { status: 400 }
      );
    }
    
    // Retrieve and decrypt the recording
    const { buffer, metadata } = await voiceDataService.getVoiceRecording(recordingId);
    
    // Convert buffer to string (for this test only - assuming it's text)
    const textData = buffer.toString('utf-8');
    
    return NextResponse.json({
      success: true,
      message: "Test data retrieved and decrypted successfully",
      data: textData,
      metadata: {
        ...metadata,
        // Remove sensitive details
        encryptionKeyId: undefined
      }
    });
  } catch (error) {
    console.error("Error in test decryption:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to retrieve and decrypt test data" 
      },
      { status: 500 }
    );
  }
}
