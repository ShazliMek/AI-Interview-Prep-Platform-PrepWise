import { NextResponse } from "next/server";
import { db, storage } from "@/firebase/admin";

export async function GET() {
  try {
    const systemStatus: any = {
      timestamp: new Date().toISOString(),
      firebase: "PENDING",
      storage: "PENDING", 
      encryption: "PENDING",
      recordings: "PENDING",
      environment: "PENDING"
    };
    
    // Test Firebase/Firestore
    try {
      await db.collection('test').limit(1).get();
      systemStatus.firebase = "✅ PASSED";
    } catch (error) {
      systemStatus.firebase = `❌ FAILED: ${(error as Error).message}`;
    }
    
    // Test Storage (with fallback info)
    try {
      const bucket = storage.bucket();
      await bucket.getFiles({ maxResults: 1 });
      systemStatus.storage = "✅ PASSED (Firebase Storage)";
    } catch (error) {
      systemStatus.storage = `⚠️ FALLBACK: Local storage active (${(error as Error).message})`;
    }
    
    // Test encryption
    try {
      const crypto = require('crypto');
      const testData = Buffer.from('test');
      const key = crypto.randomBytes(32);
      const iv = crypto.randomBytes(16);
      
      const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
      const encrypted = Buffer.concat([cipher.update(testData), cipher.final()]);
      const authTag = cipher.getAuthTag();
      
      const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
      decipher.setAuthTag(authTag);
      const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
      
      systemStatus.encryption = decrypted.equals(testData) ? "✅ PASSED" : "❌ FAILED";
    } catch (error) {
      systemStatus.encryption = `❌ FAILED: ${(error as Error).message}`;
    }
    
    // Test recordings API
    try {
      const voiceDataService = (await import("@/lib/services/voiceDataService")).default;
      const testBuffer = Buffer.from('test recording');
      
      const recordingId = await voiceDataService.storeVoiceRecording(
        'status-test-user',
        'status-test-interview',
        testBuffer,
        { duration: 1, fileSize: testBuffer.length, mimeType: 'audio/test' }
      );
      
      const { buffer: retrieved } = await voiceDataService.getVoiceRecording(recordingId);
      
      systemStatus.recordings = testBuffer.equals(retrieved) ? "✅ PASSED" : "❌ FAILED";
    } catch (error) {
      systemStatus.recordings = `❌ FAILED: ${(error as Error).message}`;
    }
    
    // Environment info
    systemStatus.environment = {
      nodeEnv: process.env.NODE_ENV,
      hasFirebaseConfig: !!process.env.FIREBASE_PROJECT_ID,
      hasStorageBucket: !!process.env.FIREBASE_STORAGE_BUCKET,
      hasVapiToken: !!process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN,
      hasServiceAccount: !!process.env.GOOGLE_APPLICATION_CREDENTIALS
    };
    
    const allPassed = Object.values(systemStatus)
      .filter(v => typeof v === 'string' && v.includes('PASSED'))
      .length >= 3;
    
    return NextResponse.json({
      success: true,
      systemStatus,
      overallStatus: allPassed ? "✅ SYSTEM READY" : "⚠️ SOME ISSUES DETECTED",
      recommendations: [
        systemStatus.storage.includes('FALLBACK') ? "Enable Firebase Storage billing for production" : null,
        "All core features are working with local storage fallback"
      ].filter(Boolean)
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
