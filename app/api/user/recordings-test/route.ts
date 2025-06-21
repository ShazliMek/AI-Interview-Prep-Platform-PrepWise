import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/actions/auth.actions";

// Simplified recordings API for testing
export async function GET() {
  try {
    console.log("[Recordings API] Starting request...");
    
    // Test 1: User authentication
    const user = await getCurrentUser();
    console.log("[Recordings API] User check:", user ? "authenticated" : "not authenticated");
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Test 2: Firebase import
    let db;
    try {
      const firebaseAdmin = await import("@/firebase/admin");
      db = firebaseAdmin.db;
      console.log("[Recordings API] Firebase imported successfully");
    } catch (importError) {
      console.error("[Recordings API] Firebase import failed:", importError);
      return NextResponse.json(
        { success: false, message: "Firebase configuration error", error: (importError as Error).message },
        { status: 500 }
      );
    }

    // Test 3: Firestore query
    try {
      const recordingsSnapshot = await db
        .collection("voice_recordings")
        .where("userId", "==", user.id)
        .orderBy("createdAt", "desc")
        .limit(10)
        .get();

      console.log("[Recordings API] Query successful, found:", recordingsSnapshot.size, "recordings");

      const recordings = recordingsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Don't include encryption key details
        encryptionKeyId: undefined
      }));

      return NextResponse.json({ 
        success: true, 
        recordings,
        count: recordings.length
      });
    } catch (queryError) {
      console.error("[Recordings API] Firestore query failed:", queryError);
      return NextResponse.json(
        { success: false, message: "Database query failed", error: (queryError as Error).message },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("[Recordings API] General error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error", error: (error as Error).message },
      { status: 500 }
    );
  }
}

// Simple POST for testing
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: "POST endpoint working",
      user: user.id
    });
  } catch (error) {
    console.error("[Recordings API POST] Error:", error);
    return NextResponse.json(
      { success: false, message: "POST failed", error: (error as Error).message },
      { status: 500 }
    );
  }
}
