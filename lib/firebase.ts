// lib/firebase.ts

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app"
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  connectAuthEmulator,
  type Auth,
} from "firebase/auth"
import {
  getFirestore,
  connectFirestoreEmulator,
  type Firestore,
} from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

export const isFirebaseAvailable = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.storageBucket &&
  firebaseConfig.messagingSenderId &&
  firebaseConfig.appId
)

let app: FirebaseApp | null = null
let auth: Auth | null = null
let db: Firestore | null = null
let googleProvider: GoogleAuthProvider | null = null
let facebookProvider: FacebookAuthProvider | null = null

if (isFirebaseAvailable) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
    auth = getAuth(app)
    db = getFirestore(app)

    googleProvider = new GoogleAuthProvider()
    googleProvider.addScope("email")
    googleProvider.addScope("profile")

    facebookProvider = new FacebookAuthProvider()
    facebookProvider.addScope("email")
    facebookProvider.addScope("public_profile")

    console.log("✅ Firebase initialized successfully")
  } catch (error) {
    console.warn("❌ Firebase initialization failed:", error)
    app = null
    auth = null
    db = null
    googleProvider = null
    facebookProvider = null
  }
} else {
  console.warn("⚠️ Firebase config not found, running in mock mode")
}

if (
  typeof window !== "undefined" &&
  window.location.hostname === "localhost" &&
  auth &&
  db
) {
  connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true })
  connectFirestoreEmulator(db, "localhost", 8080)
}

export { app, auth, db, googleProvider, facebookProvider }
