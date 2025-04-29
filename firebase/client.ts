// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD7PXI53X3EPzJzL3Lts6s3F7-BQCM-wTY",
  authDomain: "jobly-92ac1.firebaseapp.com",
  projectId: "jobly-92ac1",
  storageBucket: "jobly-92ac1.firebasestorage.app",
  messagingSenderId: "939231843151",
  appId: "1:939231843151:web:92dfc0621c5b51ea4b6b3a",
  measurementId: "G-MMLBVFJ8PD"
};
 
// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp() ;

export const auth = getAuth(app);

export const db = getFirestore(app)