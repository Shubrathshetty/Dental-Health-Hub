// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBL_0GrT3ZafKLAO50mxNhVXiJxhBRi_Eo",
  authDomain: "dental-health-hub.firebaseapp.com",
  projectId: "dental-health-hub",
  storageBucket: "dental-health-hub.firebasestorage.app",
  messagingSenderId: "1069464848894",
  appId: "1:1069464848894:web:211ddf68f7ec68a7e498af",
  measurementId: "G-PMQQQS9P4Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
