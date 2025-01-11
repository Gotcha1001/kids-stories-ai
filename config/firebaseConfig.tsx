import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "kids-story-13d2b.firebaseapp.com",
  projectId: "kids-story-13d2b",
  storageBucket: "kids-story-13d2b.firebasestorage.app",
  messagingSenderId: "893123780693",
  appId: "1:893123780693:web:20022e55fb7e32bdd1f4dc",
  measurementId: "G-WXCW9VMGTS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
