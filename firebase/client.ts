// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { getApps,initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDHpwUvyBEV8kLGGtUvhD-EpCjigAgdS60",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "prepwise-79abc.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "prepwise-79abc",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "prepwise-79abc.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1029819468308",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1029819468308:web:9a2fff61b9b9bbda097501",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-X97RCNZ4X1"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
//const analytics = getAnalytics(app);
// Initialize Firebase Authentication and export it
export const auth = getAuth(app);

// You can also export the app instance if needed
export const firebase = app;