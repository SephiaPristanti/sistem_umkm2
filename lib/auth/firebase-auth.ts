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
  photoURL?: string | null
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
  if (!auth || !db) return createMockUser(email, userData)

  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  const user = userCredential.user

  if (userData.displayName) {
    await updateProfile(user, { displayName: userData.displayName })
  }

  const userProfile: UserProfile = {
    uid: user.uid,
    email: user.email!,
    displayName: userData.displayName || "",
    photoURL: user.photoURL ?? null,
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
  return auth
    ? await signInWithEmailAndPassword(auth, email, password)
    : createMockUser(email, { displayName: "Demo User" })
}

export const signInWithGoogle = async (): Promise<UserCredential> => {
  const auth = getAuthInstance()
  const db = getFirestoreInstance()
  const { google: provider } = getProviders()
  if (!auth || !db) return createMockUser("user@google.com", { displayName: "Google User" })

  const result = await signInWithPopup(auth, provider)
  const user = result.user

  const docSnap = await getDoc(doc(db, "users", user.uid))
  if (!docSnap.exists()) {
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email!,
      displayName: user.displayName || "",
      photoURL: user.photoURL ?? null,
      role: "user",
      isEmailVerified: user.emailVerified,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  return result
}

export const signInWithFacebook = async (): Promise<UserCredential> => {
  const auth = getAuthInstance()
  const db = getFirestoreInstance()
  const { facebook: provider } = getProviders()
  if (!auth || !db) return createMockUser("user@facebook.com", { displayName: "Facebook User" })

  const result = await signInWithPopup(auth, provider)
  const user = result.user

  const docSnap = await getDoc(doc(db, "users", user.uid))
  if (!docSnap.exists()) {
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email!,
      displayName: user.displayName || "",
      photoURL: user.photoURL ?? null,
      role: "user",
      isEmailVerified: user.emailVerified,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  return result
}

export const signOutUser = async (): Promise<void> => {
  const auth = getAuthInstance()
  if (auth) await signOut(auth)
}

export const resetPassword = async (email: string): Promise<void> => {
  const auth = getAuthInstance()
  if (auth) await sendPasswordResetEmail(auth, email)
}

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const db = getFirestoreInstance()
  if (!db) {
    return {
      uid,
      email: "mock@example.com",
      displayName: "Mock User",
      role: "user",
      isEmailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }

  const docSnap = await getDoc(doc(db, "users", uid))
  return docSnap.exists() ? (docSnap.data() as UserProfile) : null
}

export const updateUserProfile = async (uid: string, updates: Partial<UserProfile>): Promise<void> => {
  const db = getFirestoreInstance()
  if (db) {
    await updateDoc(doc(db, "users", uid), {
      ...updates,
      updatedAt: new Date(),
    })
  }
}
