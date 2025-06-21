import admin from "firebase-admin";
import fs from 'fs';
import path from 'path';

// Service account file path - using ai-interview-prep-36e64 project
const serviceAccountPath = path.join(process.cwd(), "ai-interview-prep-36e64-firebase-adminsdk-fbsvc-cf50acf351.json");

let app: admin.app.App;

if (!admin.apps.length) {
  try {
    console.log(`[Firebase Admin] Loading service account from: ${serviceAccountPath}`);
    
    // Read and parse the service account file
    const serviceAccountContent = fs.readFileSync(serviceAccountPath, 'utf8');
    const serviceAccount = JSON.parse(serviceAccountContent);
    
    // Initialize the app with the service account
    app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    
    console.log(`[Firebase Admin] SDK initialized successfully. Project ID: ${serviceAccount.project_id}`);
  } catch (error) {
    console.error("[Firebase Admin] SDK initialization failed:", error);
    throw new Error("Failed to initialize Firebase Admin SDK. Check the service account file path and contents.");
  }
} else {
  app = admin.app();
  console.log("[Firebase Admin] Using existing app instance.");
}

// Export auth and firestore
export const auth = admin.auth(app);
export const db = admin.firestore(app);