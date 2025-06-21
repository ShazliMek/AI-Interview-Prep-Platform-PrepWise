import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/actions/auth.actions";
import voiceDataService from "@/lib/services/voiceDataService";

export async function POST(request: Request) {
  try {
    // Get the current user
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Parse the request body
    const body = await request.json();
    const { data, metadata } = body;
    
    if (!data || !metadata) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Convert base64 string back to buffer
    const buffer = Buffer.from(
      data, 
      'base64'
    );
    
    // Use a placeholder interview ID for testing
    const testInterviewId = `test-interview-${Date.now()}`;
    
    // Store the encrypted recording
    const recordingId = await voiceDataService.storeVoiceRecording(
      user.id,
      testInterviewId,
      buffer,
      metadata
    );
    
    return NextResponse.json({
      success: true,
      message: "Test data encrypted and stored successfully",
      recordingId
    });
  } catch (error) {
    console.error("Error in test encryption:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to encrypt test data" 
      },
      { status: 500 }
    );
  }
}
