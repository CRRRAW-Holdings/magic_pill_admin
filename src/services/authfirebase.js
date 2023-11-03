// Imports for Firebase
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Import getFirestore

// Configuration for Firebase Authentication (Old Project)
const firebaseAuthConfig = {
  apiKey: process.env.REACT_APP_AUTH_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_AUTH_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_AUTH_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_AUTH_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_AUTH_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_AUTH_FIREBASE_MEASUREMENT_ID
};

// Configuration for Firestore (New Project)
const firebaseFirestoreConfig = {
  apiKey: process.env.REACT_APP_FIRESTORE_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIRESTORE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIRESTORE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIRESTORE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIRESTORE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIRESTORE_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIRESTORE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase Apps
const authApp = initializeApp(firebaseAuthConfig, 'authApp');
const firestoreApp = initializeApp(firebaseFirestoreConfig, 'firestoreApp');

// Get the services from the respective apps
const firebaseAuth = getAuth(authApp);
const firestore = getFirestore(firestoreApp);

// Export the services
export { firebaseAuth, firestore };
