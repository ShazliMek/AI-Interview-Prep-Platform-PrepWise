import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/actions/auth.actions";
import { getDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    // Check authentication
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User not authenticated",
        debug: {
          hasUser: false,
          userId: null
        }
      });
    }
    
    // Check database for user's recordings
    const db = await getDatabase();
    const userRecordings = await db.collection('voice_recordings').find({
      userId: user.id
    }, {
      projection: { _id: 1, userId: 1, interviewId: 1, createdAt: 1, processingStatus: 1 }
    }).toArray();
    
    return NextResponse.json({
      success: true,
      debug: {
        hasUser: true,
        userId: user.id,
        userEmail: user.email,
        recordingsCount: userRecordings.length,
        recordings: userRecordings.map(r => ({
          id: r._id.toString(),
          interviewId: r.interviewId,
          createdAt: r.createdAt,
          processingStatus: r.processingStatus
        }))
      }
    });
  } catch (error) {
    console.error("Error in auth debug:", error);
    return NextResponse.json({
      success: false,
      message: "Debug failed",
      error: (error as Error).message
    }, { status: 500 });
  }
}
