import { NextResponse } from "next/server";
import { storage } from "@/firebase/admin";

export async function GET() {
  try {
    const results: any = {
      defaultBucket: "PENDING",
      bucketCreation: "PENDING",
      bucketList: "PENDING"
    };
    
    // Try to get the default bucket
    try {
      const bucket = storage.bucket();
      console.log(`Trying bucket: ${bucket.name}`);
      await bucket.getFiles({ maxResults: 1 });
      results.defaultBucket = `PASSED: ${bucket.name}`;
    } catch (error) {
      results.defaultBucket = `FAILED: ${(error as Error).message}`;
    }
    
    // Try creating a bucket if default doesn't work
    try {
      const bucketName = 'ai-interview-prep-36e64.appspot.com';
      const bucket = storage.bucket(bucketName);
      
      // Check if bucket exists
      const [exists] = await bucket.exists();
      if (!exists) {
        console.log(`Bucket ${bucketName} does not exist, attempting to create...`);
        await bucket.create({
          location: 'us-central1',
          storageClass: 'STANDARD',
        });
        results.bucketCreation = `CREATED: ${bucketName}`;
      } else {
        results.bucketCreation = `EXISTS: ${bucketName}`;
      }
    } catch (error) {
      results.bucketCreation = `FAILED: ${(error as Error).message}`;
    }
    
    // List all buckets
    try {
      // Note: getBuckets is not available in Firebase Admin SDK
      // We'll try to test with known bucket names instead
      const knownBuckets = [
        'ai-interview-prep-36e64.appspot.com',
        'ai-interview-prep-36e64.firebasestorage.app'
      ];
      
      const bucketTests = [];
      for (const bucketName of knownBuckets) {
        try {
          const bucket = storage.bucket(bucketName);
          const [exists] = await bucket.exists();
          bucketTests.push({ name: bucketName, exists });
        } catch (error) {
          bucketTests.push({ name: bucketName, error: (error as Error).message });
        }
      }
      
      results.bucketList = bucketTests;
    } catch (error) {
      results.bucketList = `FAILED: ${(error as Error).message}`;
    }
    
    return NextResponse.json({
      success: true,
      results,
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
