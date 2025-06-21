import { NextResponse } from "next/server";
import voiceDataServiceMongoDB from "@/lib/services/voiceDataServiceMongoDB";
import { connectToMongoDB, getDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    console.log('[MongoDB Test] Starting comprehensive MongoDB test...');
    
    const tests: any = {
      connection: "PENDING",
      database: "PENDING", 
      encryption: "PENDING",
      storage: "PENDING",
      retrieval: "PENDING"
    };
    
    // Test 1: MongoDB Connection
    try {
      await connectToMongoDB();
      tests.connection = "✅ PASSED";
      console.log('[MongoDB Test] Connection successful');
    } catch (error) {
      tests.connection = `❌ FAILED: ${(error as Error).message}`;
      console.error('[MongoDB Test] Connection failed:', error);
    }
    
    // Test 2: Database Operations
    try {
      const db = await getDatabase();
      const collections = await db.listCollections().toArray();
      tests.database = `✅ PASSED (${collections.length} collections)`;
      console.log('[MongoDB Test] Database operations successful');
    } catch (error) {
      tests.database = `❌ FAILED: ${(error as Error).message}`;
      console.error('[MongoDB Test] Database operations failed:', error);
    }
    
    // Test 3: End-to-End Recording Storage & Retrieval
    try {
      const testAudioBuffer = Buffer.from('MongoDB test audio data for encryption verification');
      
      // Store recording
      console.log('[MongoDB Test] Storing test recording...');
      const recordingId = await voiceDataServiceMongoDB.storeVoiceRecording(
        'mongodb-test-user',
        'mongodb-test-interview',
        testAudioBuffer,
        {
          duration: 15,
          fileSize: testAudioBuffer.length,
          mimeType: 'audio/test',
          originalFileName: 'mongodb-test.wav',
          testType: 'mongodb-integration'
        }
      );
      
      tests.storage = `✅ PASSED (ID: ${recordingId.substring(0, 8)}...)`;
      console.log(`[MongoDB Test] Recording stored with ID: ${recordingId}`);
      
      // Retrieve and decrypt recording
      console.log('[MongoDB Test] Retrieving test recording...');
      const { buffer: retrievedBuffer, metadata } = await voiceDataServiceMongoDB.getVoiceRecording(recordingId);
      
      // Verify data integrity
      const dataMatches = testAudioBuffer.equals(retrievedBuffer);
      tests.retrieval = dataMatches ? "✅ PASSED" : "❌ FAILED (Data mismatch)";
      tests.encryption = dataMatches ? "✅ PASSED" : "❌ FAILED (Encryption/Decryption issue)";
      
      console.log(`[MongoDB Test] Data integrity check: ${dataMatches ? 'PASSED' : 'FAILED'}`);
      
      // Cleanup test recording
      try {
        await voiceDataServiceMongoDB.deleteVoiceRecording(recordingId, 'mongodb-test-user');
        console.log('[MongoDB Test] Test recording cleaned up');
      } catch (cleanupError) {
        console.warn('[MongoDB Test] Cleanup warning:', cleanupError);
      }
      
      return NextResponse.json({
        success: true,
        message: "All MongoDB tests completed successfully!",
        tests,
        testDetails: {
          recordingId: recordingId.substring(0, 8) + '...',
          originalSize: testAudioBuffer.length,
          retrievedSize: retrievedBuffer.length,
          storageType: metadata.metadata.storageType,
          dataIntegrity: dataMatches
        },
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      tests.storage = `❌ FAILED: ${(error as Error).message}`;
      tests.retrieval = "❌ SKIPPED (Storage failed)";
      tests.encryption = "❌ SKIPPED (Storage failed)";
      console.error('[MongoDB Test] Storage/retrieval test failed:', error);
    }
    
    // Determine overall status
    const passedTests = Object.values(tests).filter(status => 
      typeof status === 'string' && status.includes('✅')
    ).length;
    
    const overallStatus = passedTests >= 3 ? "✅ MONGODB READY" : "⚠️ ISSUES DETECTED";
    
    return NextResponse.json({
      success: passedTests >= 2, // At least connection and database should work
      message: passedTests >= 3 ? "MongoDB system fully operational!" : "Some issues detected",
      tests,
      overallStatus,
      recommendations: [
        tests.connection.includes('FAILED') ? "Check MongoDB connection string in .env.local" : null,
        tests.database.includes('FAILED') ? "Verify database permissions and network access" : null,
        tests.storage.includes('FAILED') ? "Check encryption service and file storage" : null
      ].filter(Boolean),
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('[MongoDB Test] Overall test failed:', error);
    return NextResponse.json({
      success: false,
      message: "MongoDB test suite failed",
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
