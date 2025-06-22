import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/actions/auth.actions";
import voiceDataServiceMongoDB from "@/lib/services/voiceDataServiceMongoDB";

// GET user's voice recordings from MongoDB
export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Fetch recordings from MongoDB
    const recordings = await voiceDataServiceMongoDB.getUserRecordings(user.id, 50);
    
    // Remove sensitive data
    const sanitizedRecordings = recordings.map(recording => ({
      id: recording._id,
      userId: recording.userId,
      interviewId: recording.interviewId,
      processingStatus: recording.processingStatus,
      rec_length: recording.rec_length || 0, // Include recording duration from visual timer
      createdAt: recording.createdAt,
      expiresAt: recording.expiresAt,
      metadata: {
        ...recording.metadata,
        // Remove encryption details from client response
        encryptionKeyId: undefined
      }
    }));
    
    return NextResponse.json({ 
      success: true, 
      recordings: sanitizedRecordings,
      total: recordings.length
    });
  } catch (error) {
    console.error("Error fetching recordings from MongoDB:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch recordings" },
      { status: 500 }
    );
  }
}

// POST new voice recording to MongoDB
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
    
    console.log('[MongoDB Recordings API] Processing file upload:', {
      filename: audioFile.name,
      size: audioFile.size,
      type: audioFile.type,
      interviewId,
      userId: user.id
    });
    
    // Store the recording using MongoDB voice data service
    const recordingId = await voiceDataServiceMongoDB.storeVoiceRecording(
      user.id,
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
    
    console.log(`[MongoDB Recordings API] Recording stored successfully with ID: ${recordingId}`);
    
    return NextResponse.json({ 
      success: true, 
      recordingId,
      message: "Recording stored successfully in MongoDB",
      storage: "mongodb"
    });
  } catch (error) {
    console.error("Error storing recording in MongoDB:", error);
    return NextResponse.json(
      { success: false, message: "Failed to store recording", error: (error as Error).message },
      { status: 500 }
    );
  }
}

// DELETE voice recording from MongoDB
export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const recordingId = searchParams.get('id');
    
    if (!recordingId) {
      return NextResponse.json(
        { success: false, message: "Recording ID is required" },
        { status: 400 }
      );
    }
    
    // Delete the recording using MongoDB voice data service
    const deleted = await voiceDataServiceMongoDB.deleteVoiceRecording(recordingId, user.id);
    
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Recording not found or unauthorized" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: "Recording deleted successfully from MongoDB"
    });
  } catch (error) {
    console.error("Error deleting recording from MongoDB:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete recording", error: (error as Error).message },
      { status: 500 }
    );
  }
}
