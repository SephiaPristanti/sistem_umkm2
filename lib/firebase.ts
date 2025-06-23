import {
  initializeApp,
  getApps,
  getApp,
  type FirebaseApp,
} from "firebase/app"
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

// Cek ketersediaan ENV variabel saat dipanggil, bukan saat file di-load
const isFirebaseAvailable = () =>
  Boolean(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET &&
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID &&
      process.env.NEXT_PUBLIC_FIREBASE_APP_ID
  )

export const getFirebaseApp = (): FirebaseApp | null => {
  if (!isFirebaseAvailable()) return null

  try {
    return getApps().length === 0
      ? initializeApp({
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
          authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
          storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
          messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
          appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
          measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
        })
      : getApp()
  } catch {
    return null
  }
}

export const getAuthInstance = (): Auth | null => {
  const app = getFirebaseApp()
  if (!app) return null
  return getAuth(app)
}

export const getFirestoreInstance = (): Firestore | null => {
  const app = getFirebaseApp()
  if (!app) return null
  return getFirestore(app)
}

export const getProviders = () => {
  const google = new GoogleAuthProvider()
  google.addScope("email")
  google.addScope("profile")

  const facebook = new FacebookAuthProvider()
  facebook.addScope("email")
  facebook.addScope("public_profile")

  return { google, facebook }
}
