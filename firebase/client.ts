// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyCcyjllnklJH9sJzeqx9cPnFo7JaxBDMBA",
  authDomain: "prepwise-ae1f7.firebaseapp.com",
  projectId: "prepwise-ae1f7",
  storageBucket: "prepwise-ae1f7.firebasestorage.app",
  messagingSenderId: "1016069822982",
  appId: "1:1016069822982:web:81d0444f128648c3c10187",
  measurementId: "G-Z7CLD02B3T"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);