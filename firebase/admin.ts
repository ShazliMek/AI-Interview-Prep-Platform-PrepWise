import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import admin from "firebase-admin";

// At the top of your file
import * as dotenv from 'dotenv';
// Load from .env.local specifically for this file
dotenv.config({ path: '.env.local' });

// Option 1: From environment variable (recommended for production)
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

// Option 2: Direct path (ensure this file is secure and not publicly accessible)
// IMPORTANT: Replace with the CORRECT service account JSON file for your client-side Firebase project.
const directServiceAccountPath = "../prepwise-79abc-firebase-adminsdk-fbsvc-8b0ed1970d.json"; // CHECK THIS FILENAME

let app: admin.app.App;

if (!admin.apps.length) {
  try {
    let credential;
    if (serviceAccountPath) {
      console.log("[Firebase Admin] Initializing with GOOGLE_APPLICATION_CREDENTIALS:", serviceAccountPath);
      credential = admin.credential.cert(serviceAccountPath);
    } else {
      console.log(`[Firebase Admin] GOOGLE_APPLICATION_CREDENTIALS not set. Attempting to load: ${directServiceAccountPath}`);
      const serviceAccountJson = require(directServiceAccountPath);
      credential = admin.credential.cert(serviceAccountJson);
    }
    app = admin.initializeApp({ credential });
    console.log("[Firebase Admin] SDK initialized. Project ID:", app.options.projectId);
  } catch (error) {
    console.error("[Firebase Admin] SDK initialization failed:", error);
    // Throw error or handle as per application needs, auth and db will be undefined.
    // For now, we'll let auth and db be potentially null and let runtime errors occur if not initialized.
  }
} else {
  app = admin.app();
  console.log("[Firebase Admin] Using existing app. Project ID:", app.options.projectId);
}

// Ensure app is defined before accessing auth() or firestore()
export const auth = app! ? admin.auth(app) : null;
export const db = app! ? admin.firestore(app) : null;

if (!auth || !db) {
  console.error("[Firebase Admin] Auth or DB is not initialized. This will cause errors.");
}