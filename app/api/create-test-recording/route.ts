import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/actions/auth.actions";
import voiceDataServiceMongoDB from "@/lib/services/voiceDataServiceMongoDB";

export async function POST() {
  try {
    // Check authentication
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "Authentication required to create test recording"
      }, { status: 401 });
    }
    
    // Create a test audio buffer (simple wave pattern)
    const sampleRate = 44100;
    const duration = 2; // 2 seconds
    const numSamples = sampleRate * duration;
    const buffer = new ArrayBuffer(44 + numSamples * 2); // WAV header + 16-bit samples
    const view = new DataView(buffer);
    
    // Write WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + numSamples * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, numSamples * 2, true);
    
    // Generate simple sine wave
    for (let i = 0; i < numSamples; i++) {
      const sample = Math.sin(2 * Math.PI * 440 * i / sampleRate) * 0.5; // 440 Hz tone
      const intSample = Math.max(-32768, Math.min(32767, sample * 32767));
      view.setInt16(44 + i * 2, intSample, true);
    }
    
    const testAudioBuffer = Buffer.from(buffer);
    
    // Store recording with user's actual ID
    console.log(`[Test Recording] Creating test recording for user: ${user.id}`);
    const recordingId = await voiceDataServiceMongoDB.storeVoiceRecording(
      user.id, // Use the actual authenticated user's ID
      'test-interview-playback',
      testAudioBuffer,
      {
        duration: duration,
        fileSize: testAudioBuffer.length,
        mimeType: 'audio/wav',
        originalFileName: 'test-recording.wav',
        interviewType: 'test',
        notes: 'Test recording for playback verification'
      }
    );
    
    console.log(`[Test Recording] Created recording with ID: ${recordingId}`);
    
    return NextResponse.json({
      success: true,
      message: "Test recording created successfully",
      recordingId: recordingId,
      userId: user.id,
      fileSize: testAudioBuffer.length,
      duration: duration
    });
    
  } catch (error) {
    console.error("Error creating test recording:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to create test recording",
      error: (error as Error).message
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "Authentication required"
      }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const recordingId = searchParams.get('id');
    
    if (!recordingId) {
      return NextResponse.json({
        success: false,
        message: "Recording ID required"
      }, { status: 400 });
    }
    
    await voiceDataServiceMongoDB.deleteVoiceRecording(recordingId, user.id);
    
    return NextResponse.json({
      success: true,
      message: "Test recording deleted"
    });
    
  } catch (error) {
    console.error("Error deleting test recording:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to delete test recording",
      error: (error as Error).message
    }, { status: 500 });
  }
}
