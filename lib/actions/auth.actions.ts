'use server';

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";


// Session duration (1 week)
const SESSION_DURATION = 60 * 60 * 24 * 7;

// Set session cookie
export async function setSessionCookie(idToken: string) {
  if (!auth) {
    console.error("Error setting session cookie: Firebase Admin SDK not initialized.");
    return false;
  }
  try {
    const cookieStore = await cookies();

    console.log("Creating session cookie from idToken");
    
    // Create session cookie
    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: SESSION_DURATION * 1000, // milliseconds
    });

    console.log("Session cookie created successfully");

    // Set cookie in the browser
    cookieStore.set("session", sessionCookie, {
      maxAge: SESSION_DURATION,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });
    
    return true;
  } catch (error) {
    console.error("Error setting session cookie:", error);
    return false;
  }
}

export async function signUp(params: SignUpParams) {
  const { uid, name, email, password } = params;

  if (!db) {
    console.error("Sign-up error: Firebase Admin SDK (Firestore) not initialized.");
    return {
      success: false,
      message: "Server database error. Please try again later."
    };
  }

  try {
    // check if user exists in db
    const userRecord = await db.collection("users").doc(uid).get();
    if (userRecord.exists)
      return {
        success: false,
        message: "User already exists. Please sign in.",
      };
    // save user to db
    await db.collection("users").doc(uid).set({
      name,
      email,
      // profileURL,
      // resumeURL,
    });

    // Get the ID token to set session cookie
    // Note: password is not needed here as auth is already handled by Firebase client
    // but we keep it in the params to match the interface

    return {
      success: true,
      message: "Account created successfully. Please sign in.",
    };
  } catch (error: any) {
    console.error("Error creating user", error);

    // Handle Firebase specific errors
    if (error.code === "auth/email-already-exists") {
      return {
        success: false,
        message: "This email is already in use",
      };
    } else if (error.code === "auth/invalid-email") {
      return {
        success: false,
        message: "The email address is not valid",
      };
    } else if (error.code === "auth/operation-not-allowed") {
      return {
        success: false,
        message: "Email/password accounts are not enabled",
      };
    } else if (error.code === "auth/uid-already-exists") {
      return {
        success: false,
        message: "The provided user ID is already in use",
      };
    }

    return {
      success: false,
      message: "Failed to create account. Please try again.",
    };
  }
}

export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  if (!auth) {
    console.error("Sign-in error: Firebase Admin SDK not initialized.");
    return {
      success: false,
      message: "Server authentication error. Please try again later."
    };
  }

  try {
    if (!idToken) {
      console.error("Sign-in error: No ID token provided");
      return {
        success: false,
        message: "Authentication failed. Please try again."
      };
    }

    console.log("Verifying user email:", email);
    const userRecord = await auth.getUserByEmail(email);
    if (!userRecord) {
      console.error("Sign-in error: User not found for email:", email);
      return {
        success: false,
        message: "User does not exist. Create an account.",
      };
    }

    console.log("Setting session cookie for user:", userRecord.uid);
    const cookieSet = await setSessionCookie(idToken);
    
    if (!cookieSet) {
      console.error("Failed to set session cookie");
      return {
        success: false,
        message: "Failed to create session. Please try again."
      };
    }
    
    console.log("Sign-in successful for user:", userRecord.uid);
    return {
      success: true,
      message: "Signed in successfully."
    };
    
  } catch (error: any) {
    console.error("Sign-in error:", error);
    
    // Handle specific Firebase auth error codes
    if (error.code === "auth/user-not-found") {
      return {
        success: false,
        message: "User not found. Please create an account."
      };
    } else if (error.code === "auth/invalid-credential") {
      return {
        success: false,
        message: "Invalid credentials. Please try again."
      };
    } else if (error.code === "auth/id-token-expired") {
      return {
        success: false,
        message: "Your session has expired. Please sign in again."
      };
    } else if (error.code === "auth/id-token-revoked") {
      return {
        success: false,
        message: "Your session has been revoked. Please sign in again."
      };
    } else if (error.code === "auth/invalid-id-token") {
      return {
        success: false,
        message: "Invalid authentication token. Please try again."
      };
    }

    return {
      success: false,
      message: "Failed to log into account. Please try again.",
    };
  }
}

// Sign out user by clearing the session cookie
export async function signOut() {
  const cookieStore = await cookies();

  cookieStore.delete("session");
}

// Get current user from session cookie
export async function getCurrentUser(): Promise<User | null> {
  if (!auth || !db) { // Added db check here
    console.error("[getCurrentUser] Error: Firebase Admin SDK (Auth or Firestore) not initialized.");
    return null;
  }
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;

  console.log("[getCurrentUser] Attempting to get session cookie. Value:", sessionCookie ? "Exists" : "Not Found");

  if (!sessionCookie) {
    console.log("[getCurrentUser] No session cookie found.");
    return null;
  }

  try {
    console.log("[getCurrentUser] Verifying session cookie...");
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true); // true checks for revocation
    console.log("[getCurrentUser] Session cookie verified. UID:", decodedClaims.uid);

    // get user info from db
    const userRecord = await db
      .collection("users")
      .doc(decodedClaims.uid)
      .get();

    if (!userRecord.exists) {
      console.log("[getCurrentUser] User not found in Firestore DB for UID:", decodedClaims.uid);
      return null;
    }

    console.log("[getCurrentUser] User found in Firestore DB. Email:", userRecord.data()?.email);
    return {
      ...userRecord.data(),
      id: userRecord.id,
    } as User;
  } catch (error: any) {
    console.error("[getCurrentUser] Error verifying session cookie or fetching user:", error.message);
    console.error("[getCurrentUser] Error code:", error.code); // Log specific error code if available
    // Invalid or expired session
    return null;
  }
}

// Check if user is authenticated
export async function isAuthenticated() {
  console.log("[isAuthenticated] Checking authentication status...");
  const user = await getCurrentUser();
  console.log("[isAuthenticated] User object:", user ? `Exists (ID: ${user.id})` : "null");
  return !!user;
}