// lib/firebase-auth.ts

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  type UserCredential,
} from "firebase/auth"
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore"
import {
  getAuthInstance,
  getFirestoreInstance,
  getProviders,
} from "@/lib/firebase"

export interface UserProfile {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  role: "user" | "admin"
  businessName?: string
  businessType?: string
  businessCategory?: string
  phone?: string
  address?: string
  description?: string
  isEmailVerified: boolean
  createdAt: Date
  updatedAt: Date
}

// 🔧 Fallback user for mock mode
const createMockUser = (email: string, data: Partial<UserProfile>): UserCredential => {
  return {
    user: {
      uid: `mock-${Date.now()}`,
      email,
      displayName: data.displayName || "",
      photoURL: null,
      emailVerified: false,
      isAnonymous: false,
      metadata: {
        creationTime: new Date().toISOString(),
        lastSignInTime: new Date().toISOString(),
      },
      providerData: [],
      refreshToken: "",
      tenantId: null,
      delete: async () => {},
      getIdToken: async () => "mock-token",
      getIdTokenResult: async () => ({
        token: "mock-token",
        authTime: new Date().toISOString(),
        issuedAtTime: new Date().toISOString(),
        expirationTime: new Date(Date.now() + 3600000).toISOString(),
        signInProvider: "password",
        signInSecondFactor: null,
        claims: {},
      }),
      reload: async () => {},
      toJSON: () => ({}),
    } as any,
    providerId: "password",
    operationType: "signIn",
  }
}

export const registerWithEmail = async (
  email: string,
  password: string,
  userData: Partial<UserProfile>,
): Promise<UserCredential> => {
  const auth = getAuthInstance()
  const db = getFirestoreInstance()
  if (!auth || !db) {
    console.warn("Firebase not available — mock register")
    return createMockUser(email, userData)
  }

  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  const user = userCredential.user

  if (userData.displayName) {
    await updateProfile(user, { displayName: userData.displayName })
  }

  const userProfile: UserProfile = {
    uid: user.uid,
    email: user.email!,
    displayName: user.displayName || "",
    photoURL: user.photoURL || undefined,
    role: "user",
    businessName: userData.businessName,
    businessType: userData.businessType,
    businessCategory: userData.businessCategory,
    phone: userData.phone,
    address: userData.address,
    description: userData.description,
    isEmailVerified: user.emailVerified,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  await setDoc(doc(db, "users", user.uid), userProfile)
  return userCredential
}

export const signInWithEmail = async (email: string, password: string): Promise<UserCredential> => {
  const auth = getAuthInstance()
  if (!auth) {
    console.warn("Firebase not available — mock signin")
    return createMockUser(email, { displayName: "Demo User" })
  }

  return await signInWithEmailAndPassword(auth, email, password)
}

export const signInWithGoogle = async (): Promise<UserCredential> => {
  const auth = getAuthInstance()
  const db = getFirestoreInstance()
  const { google: googleProvider } = getProviders()
  if (!auth || !db || !googleProvider) {
    console.warn("Firebase or Google provider unavailable — mock login")
    return createMockUser("user@google.com", { displayName: "Google User" })
  }

  const result = await signInWithPopup(auth, googleProvider)
  const user = result.user

  const userDoc = await getDoc(doc(db, "users", user.uid))
  if (!userDoc.exists()) {
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      displayName: user.displayName || "",
      photoURL: user.photoURL || undefined