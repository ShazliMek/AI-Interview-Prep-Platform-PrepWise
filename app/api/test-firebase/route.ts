import { NextResponse } from "next/server";
import { db, storage } from "@/firebase/admin";

export async function GET() {
  try {
    const tests: any = {
      firebase: "PENDING",
      storage: "PENDING",
      encryption: "PENDING"
    };
    
    // Test Firestore connection
    try {
      await db.collection('test').limit(1).get();
      tests.firebase = "PASSED";
    } catch (error) {
      tests.firebase = `FAILED: ${(error as Error).message}`;
    }
    
    // Test Storage connection
    try {
      const bucket = storage.bucket();
      await bucket.getFiles({ maxResults: 1 });
      tests.storage = "PASSED";
    } catch (error) {
      tests.storage = `FAILED: ${(error as Error).message}`;
    }
    
    // Test encryption functions
    try {
      const crypto = require('crypto');
      const testData = Buffer.from('test data');
      const key = crypto.randomBytes(32);
      const iv = crypto.randomBytes(16);
      
      const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
      const encrypted = Buffer.concat([cipher.update(testData), cipher.final()]);
      const authTag = cipher.getAuthTag();
      
      const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
      decipher.setAuthTag(authTag);
      const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
      
      if (decrypted.equals(testData)) {
        tests.encryption = "PASSED";
      } else {
        tests.encryption = "FAILED: Decryption mismatch";
      }
    } catch (error) {
      tests.encryption = `FAILED: ${(error as Error).message}`;
    }
    
    return NextResponse.json({
      success: true,
      tests,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
