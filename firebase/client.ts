// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { getApps,initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAaBIEu_3quQ6fj4ow7v7s3fLS9GcjDz28",
  authDomain: "ai-interview-prep-36e64.firebaseapp.com",
  projectId: "ai-interview-prep-36e64",
  storageBucket: "ai-interview-prep-36e64.firebasestorage.app",
  messagingSenderId: "524351085781",
  appId: "1:524351085781:web:4ea5dba372ea96f984d65c",
  measurementId: "G-70JGSDKDQ2"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
//const analytics = getAnalytics(app);
// Initialize Firebase Authentication and export it
export const auth = getAuth(app);

// You can also export the app instance if needed
export const firebase = app;