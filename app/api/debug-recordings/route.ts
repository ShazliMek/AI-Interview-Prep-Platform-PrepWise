import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await getDatabase();
    
    // List all recordings with their IDs
    const recordings = await db.collection('voice_recordings').find({}, {
      projection: { _id: 1, userId: 1, interviewId: 1, createdAt: 1, processingStatus: 1 }
    }).toArray();
    
    return NextResponse.json({
      success: true,
      recordings: recordings.map(r => ({
        id: r._id.toString(),
        userId: r.userId,
        interviewId: r.interviewId,
        createdAt: r.createdAt,
        processingStatus: r.processingStatus
      }))
    });
  } catch (error) {
    console.error("Error listing recordings:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to list recordings",
      error: (error as Error).message
    }, { status: 500 });
  }
}
