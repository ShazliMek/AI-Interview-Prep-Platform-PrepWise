import admin from "firebase-admin";
import fs from 'fs';
import path from 'path';

let app: admin.app.App;

if (!admin.apps.length) {
  try {
    // Check for different ways to configure Firebase Admin
    let credential: admin.credential.Credential;
    let storageBucket: string;

    // Method 1: Use GOOGLE_APPLICATION_CREDENTIALS environment variable
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      console.log(`[Firebase Admin] Using service account from GOOGLE_APPLICATION_CREDENTIALS`);
      
      const serviceAccountPath = path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS);
      const serviceAccountContent = fs.readFileSync(serviceAccountPath, 'utf8');
      const serviceAccount = JSON.parse(serviceAccountContent);
      
      credential = admin.credential.cert(serviceAccount);
      // Try multiple bucket naming conventions
      const possibleBuckets = [
        process.env.FIREBASE_STORAGE_BUCKET,
        `${serviceAccount.project_id}.appspot.com`,
        `${serviceAccount.project_id}.firebasestorage.app`,
        serviceAccount.project_id
      ].filter(Boolean);
      
      storageBucket = possibleBuckets[0] as string;
    }
    // Method 2: Fallback to hardcoded service account file
    else {
      console.log(`[Firebase Admin] Using fallback service account file`);
      const serviceAccountPath = path.join(process.cwd(), "ai-interview-prep-36e64-firebase-adminsdk-fbsvc-f4721a4b70.json");
      
      const serviceAccountContent = fs.readFileSync(serviceAccountPath, 'utf8');
      const serviceAccount = JSON.parse(serviceAccountContent);
      
      credential = admin.credential.cert(serviceAccount);
      // Try multiple bucket naming conventions
      const possibleBuckets = [
        process.env.FIREBASE_STORAGE_BUCKET,
        `${serviceAccount.project_id}.appspot.com`,
        `${serviceAccount.project_id}.firebasestorage.app`,
        serviceAccount.project_id
      ].filter(Boolean);
      
      storageBucket = possibleBuckets[0] as string;
    }

    // Initialize the app
    app = admin.initializeApp({
      credential: credential,
      storageBucket: storageBucket,
      projectId: process.env.FIREBASE_PROJECT_ID || 'ai-interview-prep-36e64'
    });
    
    console.log(`[Firebase Admin] SDK initialized successfully. Project: ${app.options.projectId}, Storage bucket: ${storageBucket}`);
    
    // Test the connection
    try {
      const bucket = app.storage().bucket();
      console.log(`[Firebase Admin] Storage bucket confirmed: ${bucket.name}`);
    } catch (bucketError) {
      console.error(`[Firebase Admin] Storage bucket verification failed:`, bucketError);
    }
  } catch (error) {
    console.error("[Firebase Admin] SDK initialization failed:", error);
    throw new Error(`Failed to initialize Firebase Admin SDK: ${(error as Error).message}`);
  }
} else {
  app = admin.app();
  console.log("[Firebase Admin] Using existing app instance.");
}

// Export auth, firestore, and storage
export const auth = admin.auth(app);
export const db = admin.firestore(app);
export const storage = admin.storage(app);