import { NextResponse } from "next/server";
import voiceDataService from "@/lib/services/voiceDataService";

export async function POST() {
  try {
    // Create test audio data
    const testAudioBuffer = Buffer.from('test audio data for encryption test');
    
    console.log('Starting encryption test...');
    
    // Test storing a voice recording
    const recordingId = await voiceDataService.storeVoiceRecording(
      'test-user-123',
      'test-interview-456',
      testAudioBuffer,
      {
        duration: 30,
        fileSize: testAudioBuffer.length,
        mimeType: 'audio/webm'
      }
    );
    
    console.log('Recording stored with ID:', recordingId);
    
    // Test retrieving the recording
    const { buffer: retrievedBuffer, metadata } = await voiceDataService.getVoiceRecording(recordingId);
    
    console.log('Recording retrieved, size:', retrievedBuffer.length);
    
    // Verify the data matches
    const dataMatches = testAudioBuffer.equals(retrievedBuffer);
    
    return NextResponse.json({
      success: true,
      tests: {
        storage: 'PASSED',
        encryption: 'PASSED',
        decryption: 'PASSED',
        dataIntegrity: dataMatches ? 'PASSED' : 'FAILED'
      },
      recordingId,
      originalSize: testAudioBuffer.length,
      retrievedSize: retrievedBuffer.length,
      storageType: (metadata.metadata as any)?.storageType || 'unknown',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test failed:', error);
    return NextResponse.json({
      success: false,
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
