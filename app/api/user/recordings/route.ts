import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/actions/auth.actions";
import { db } from "@/firebase/admin";
import voiceDataService from "@/lib/services/voiceDataService";

// GET user's voice recordings
export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Fetch recordings from Firestore
    const recordingsSnapshot = await db
      .collection("voice_recordings")
      .where("userId", "==", user.id)
      .orderBy("createdAt", "desc")
      .limit(50) // Pagination could be implemented
      .get();
    
    const recordings = recordingsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Don't include encryption key details
      encryptionKeyId: undefined
    }));
    
    return NextResponse.json({ 
      success: true, 
      recordings
    });
  } catch (error) {
    console.error("Error fetching recordings:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch recordings" },
      { status: 500 }
    );
  }
}

// POST new voice recording (from Vapi call)
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

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
    
    // Store the recording using voice data service
    const recordingId = await voiceDataService.storeVoiceRecording(
      user.id,
      interviewId,
      audioBuffer,
      {
        ...metadata,
        originalFileName: audioFile.name,
        mimeType: audioFile.type,
        fileSize: audioFile.size
      }
    );
    
    return NextResponse.json({ 
      success: true, 
      recordingId,
      message: "Recording stored successfully"
    });
  } catch (error) {
    console.error("Error storing recording:", error);
    return NextResponse.json(
      { success: false, message: "Failed to store recording" },
      { status: 500 }
    );
  }
}
export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Get the URL to extract parameters
    const { searchParams } = new URL(request.url);
    const recordingId = searchParams.get('id');
    const deleteAll = searchParams.get('all') === 'true';
    
    if (deleteAll) {
      // Find all user recordings
      const recordingsSnapshot = await db
        .collection("voice_recordings")
        .where("userId", "==", user.id)
        .get();
      
      // Delete each recording
      const deletePromises = recordingsSnapshot.docs.map(doc => 
        voiceDataService.deleteVoiceRecording(doc.id, user.id)
      );
      
      await Promise.all(deletePromises);
      
      return NextResponse.json({
        success: true,
        message: `Successfully deleted ${recordingsSnapshot.size} recordings`
      });
    } else if (recordingId) {
      // Delete a specific recording
      await voiceDataService.deleteVoiceRecording(recordingId, user.id);
      
      return NextResponse.json({
        success: true,
        message: "Recording deleted successfully"
      });
    } else {
      return NextResponse.json(
        { success: false, message: "Missing recording ID or 'all' parameter" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error deleting recordings:", error);
    const message = error instanceof Error ? error.message : "Failed to delete recordings";
    
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
