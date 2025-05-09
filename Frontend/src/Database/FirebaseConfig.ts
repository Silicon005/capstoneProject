import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCWqegTIQfgZMRCTMa6joaeiGWGLbcLkwA",
  authDomain: "mitaoe-sponsored.firebaseapp.com",
  projectId: "mitaoe-sponsored",
  storageBucket: "mitaoe-sponsored.firebasestorage.app",
  messagingSenderId: "838611310077",
  appId: "1:838611310077:web:eb2a078e5fb017ef64b594",
  measurementId: "G-SG9J5SRT1J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const app = initializeApp(firebaseConfig);

// Export Firestore instance
export const db = getFirestore(app);

// Initialize Firebase Authentication and export it
export const auth = getAuth(app);

// Export the Google Auth provider
// export const googleProvider = new GoogleAuthProvider();

// export const imgDB = getStorage(app);

// export const resDB = getStorage(app);