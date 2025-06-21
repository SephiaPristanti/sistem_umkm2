import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, connectAuthEmulator, type Auth } from "firebase/auth"
import { getFirestore, connectFirestoreEmulator, type Firestore } from "firebase/firestore"
// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
}


// Check if we have valid Firebase configuration
const hasValidConfig = () => {
  return (
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET &&
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID
  )
}

// Initialize Firebase app
let app: FirebaseApp | null = null
let auth: Auth | null = null
let db: Firestore | null = null
let googleProvider: GoogleAuthProvider | null = null
let facebookProvider: FacebookAuthProvider | null = null

// Flag to track if Firebase is available
export const isFirebaseAvailable = hasValidConfig()

if (isFirebaseAvailable) {
  try {
    // Initialize Firebase app
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

    // Initialize Firebase Authentication
    auth = getAuth(app)

    // Initialize Cloud Firestore
    db = getFirestore(app)

    // Initialize OAuth Providers
    googleProvider = new GoogleAuthProvider()
    googleProvider.addScope("email")
    googleProvider.addScope("profile")

    facebookProvider = new FacebookAuthProvider()
    facebookProvider.addScope("email")
    facebookProvider.addScope("public_profile")

    console.log("Firebase initialized successfully")
  } catch (error) {
    console.warn("Firebase initialization failed:", error)
    // Reset to null if initialization fails
    app = null
    auth = null
    db = null
    googleProvider = null
    facebookProvider = null
  }
} else {
  console.warn("Firebase configuration not found, running in demo mode")
}

// For development/demo purposes, connect to emulators if running locally
let isAuthConnectedToEmulator = false
if (
  typeof window !== "undefined" &&
  window.location.hostname === "localhost" &&
  auth &&
  db
) {
  connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
  connectFirestoreEmulator(db, "localhost", 8080);
}



export { app, auth, db, googleProvider, facebookProvider }
export default app
