import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/actions/auth.actions";
import voiceDataServiceMongoDB from "@/lib/services/voiceDataServiceMongoDB";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { interviewId, userId, duration } = await request.json();
    
    // Verify the user owns this recording
    if (userId !== user.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 403 }
      );
    }

    console.log(`[Update Duration API] Updating duration for interview: ${interviewId}, duration: ${duration}s`);
    
    // Update the recording duration in MongoDB (include userId for security)
    const result = await voiceDataServiceMongoDB.updateRecordingDuration(interviewId, duration, userId);
    
    if (result) {
      console.log(`[Update Duration API] ✅ Successfully updated duration for interview: ${interviewId}`);
      return NextResponse.json({ 
        success: true, 
        message: "Duration updated successfully",
        duration
      });
    } else {
      console.log(`[Update Duration API] ❌ Recording not found for interview: ${interviewId} and user: ${userId}`);
      return NextResponse.json(
        { success: false, message: "Recording not found or unauthorized" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("[Update Duration API] Error updating recording duration:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update duration" },
      { status: 500 }
    );
  }
}
