import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/actions/auth.actions";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const skipAuth = searchParams.get('skipAuth') === 'true';
    
    // Test 1: User authentication (skip if requested)
    let user = null;
    if (!skipAuth) {
      user = await getCurrentUser();
      if (!user) {
        return NextResponse.json({ 
          success: false, 
          error: "User not authenticated",
          tests: {
            auth: "FAILED",
            firebase: "SKIPPED",
            storage: "SKIPPED"
          },
          hint: "Add ?skipAuth=true to bypass authentication for testing"
        });
      }
    }

    // Test 2: Firebase imports
    let firebaseStatus = "UNKNOWN";
    let storageStatus = "UNKNOWN";
    let dbStatus = "UNKNOWN";

    try {
      const { db, storage } = await import("@/firebase/admin");
      firebaseStatus = "IMPORTED";

      // Test 3: Firestore connection
      try {
        const testDoc = await db.collection("test").limit(1).get();
        dbStatus = "CONNECTED";
      } catch (dbError) {
        dbStatus = `ERROR: ${(dbError as Error).message}`;
      }

      // Test 4: Storage connection
      try {
        const bucket = storage.bucket();
        const [bucketExists] = await bucket.exists();
        storageStatus = bucketExists ? "CONNECTED" : "BUCKET_NOT_FOUND";
      } catch (storageError) {
        storageStatus = `ERROR: ${(storageError as Error).message}`;
      }

    } catch (importError) {
      firebaseStatus = `IMPORT_ERROR: ${(importError as Error).message}`;
    }

    return NextResponse.json({
      success: true,
      user: user ? {
        id: user.id,
        name: user.name,
        email: user.email
      } : null,
      tests: {
        auth: user ? "PASSED" : "SKIPPED",
        firebase: firebaseStatus,
        firestore: dbStatus,
        storage: storageStatus
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasServiceAccount: process.env.GOOGLE_APPLICATION_CREDENTIALS ? "YES" : "NO"
      }
    });

  } catch (error) {
    console.error("Diagnostics error:", error);
    return NextResponse.json({
      success: false,
      error: (error as Error).message,
      tests: {
        auth: "ERROR",
        firebase: "ERROR",
        storage: "ERROR"
      }
    }, { status: 500 });
  }
}
