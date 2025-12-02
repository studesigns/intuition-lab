import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase Configuration (from voice-vault)
const firebaseConfig = {
  apiKey: "AIzaSyBXJLoUwTPTA3pwgL6rMM73KOluHrzcgxk",
  authDomain: "voice-vault-36add.firebaseapp.com",
  projectId: "voice-vault-36add",
  storageBucket: "voice-vault-36add.firebasestorage.app",
  messagingSenderId: "538100751664",
  appId: "1:538100751664:web:9ad81a6f1474d2f363fcf5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
