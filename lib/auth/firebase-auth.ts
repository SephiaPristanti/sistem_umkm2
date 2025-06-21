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
import { auth, db, googleProvider, facebookProvider, isFirebaseAvailable } from "@/lib/firebase"

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

// Mock user for development when Firebase is not available
const createMockUser = (email: string, userData: Partial<UserProfile>): UserCredential => {
  return {
    user: {
      uid: `mock-${Date.now()}`,
      email,
      displayName: userData.displayName || "",
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
    operationType: "signIn" as any,
  }
}

// Register with email and password
export const registerWithEmail = async (
  email: string,
  password: string,
  userData: Partial<UserProfile>,
): Promise<UserCredential> => {
  try {
    if (!isFirebaseAvailable || !auth || !db) {
      console.warn("Firebase not available, using mock authentication")
      return createMockUser(email, userData)
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Update display name
    if (userData.displayName) {
      await updateProfile(user, {
        displayName: userData.displayName,
      })
    }

    // Create user profile in Firestore
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      displayName: userData.displayName || "",
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
  } catch (error) {
    console.error("Error registering user:", error)
    throw new Error("Registrasi gagal. Silakan coba lagi.")
  }
}

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string): Promise<UserCredential> => {
  try {
    if (!isFirebaseAvailable || !auth) {
      console.warn("Firebase not available, using mock authentication")
      // For demo purposes, accept any email/password combination
      return createMockUser(email, { displayName: "Demo User" })
    }

    return await signInWithEmailAndPassword(auth, email, password)
  } catch (error: any) {
    console.error("Error signing in:", error)

    // Provide user-friendly error messages
    if (error.code === "auth/user-not-found") {
      throw new Error("Email tidak ditemukan. Silakan daftar terlebih dahulu.")
    } else if (error.code === "auth/wrong-password") {
      throw new Error("Password salah. Silakan coba lagi.")
    } else if (error.code === "auth/invalid-email") {
      throw new Error("Format email tidak valid.")
    } else if (error.code === "auth/too-many-requests") {
      throw new Error("Terlalu banyak percobaan login. Silakan coba lagi nanti.")
    } else {
      throw new Error("Login gagal. Silakan coba lagi.")
    }
  }
}

// Sign in with Google
export const signInWithGoogle = async (): Promise<UserCredential> => {
  try {
    if (!isFirebaseAvailable || !auth || !googleProvider) {
      console.warn("Firebase or Google provider not available, using mock authentication")
      return createMockUser("user@google.com", { displayName: "Google User" })
    }

    const result = await signInWithPopup(auth, googleProvider)
    const user = result.user

    // Check if user profile exists, if not create one
    const userDoc = await getDoc(doc(db!, "users", user.uid))

    if (!userDoc.exists()) {
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        displayName: user.displayName || "",
        photoURL: user.photoURL || undefined,
        role: "user",
        isEmailVerified: user.emailVerified,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      await setDoc(doc(db!, "users", user.uid), userProfile)
    }

    return result
  } catch (error: any) {
    console.error("Error signing in with Google:", error)

    if (error.code === "auth/popup-closed-by-user") {
      throw new Error("Login dibatalkan oleh pengguna.")
    } else if (error.code === "auth/popup-blocked") {
      throw new Error("Popup diblokir oleh browser. Silakan izinkan popup dan coba lagi.")
    } else {
      throw new Error("Login dengan Google gagal. Silakan coba lagi.")
    }
  }
}

// Sign in with Facebook
export const signInWithFacebook = async (): Promise<UserCredential> => {
  try {
    if (!isFirebaseAvailable || !auth || !facebookProvider) {
      console.warn("Firebase or Facebook provider not available, using mock authentication")
      return createMockUser("user@facebook.com", { displayName: "Facebook User" })
    }

    const result = await signInWithPopup(auth, facebookProvider)
    const user = result.user

    // Check if user profile exists, if not create one
    const userDoc = await getDoc(doc(db!, "users", user.uid))

    if (!userDoc.exists()) {
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        displayName: user.displayName || "",
        photoURL: user.photoURL || undefined,
        role: "user",
        isEmailVerified: user.emailVerified,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      await setDoc(doc(db!, "users", user.uid), userProfile)
    }

    return result
  } catch (error: any) {
    console.error("Error signing in with Facebook:", error)

    if (error.code === "auth/popup-closed-by-user") {
      throw new Error("Login dibatalkan oleh pengguna.")
    } else if (error.code === "auth/popup-blocked") {
      throw new Error("Popup diblokir oleh browser. Silakan izinkan popup dan coba lagi.")
    } else {
      throw new Error("Login dengan Facebook gagal. Silakan coba lagi.")
    }
  }
}

// Sign out
export const signOutUser = async (): Promise<void> => {
  try {
    if (!isFirebaseAvailable || !auth) {
      console.warn("Firebase not available, mock sign out")
      return
    }

    await signOut(auth)
  } catch (error) {
    console.error("Error signing out:", error)
    throw new Error("Logout gagal. Silakan coba lagi.")
  }
}

// Reset password
export const resetPassword = async (email: string): Promise<void> => {
  try {
    if (!isFirebaseAvailable || !auth) {
      console.warn("Firebase not available, mock password reset")
      return
    }

    await sendPasswordResetEmail(auth, email)
  } catch (error: any) {
    console.error("Error sending password reset email:", error)

    if (error.code === "auth/user-not-found") {
      throw new Error("Email tidak ditemukan.")
    } else if (error.code === "auth/invalid-email") {
      throw new Error("Format email tidak valid.")
    } else {
      throw new Error("Gagal mengirim email reset password. Silakan coba lagi.")
    }
  }
}

// Get user profile from Firestore
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    if (!isFirebaseAvailable || !db) {
      console.warn("Firebase not available, returning mock profile")
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

    const userDoc = await getDoc(doc(db, "users", uid))
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile
    }
    return null
  } catch (error) {
    console.error("Error getting user profile:", error)
    return null
  }
}

// Update user profile
export const updateUserProfile = async (uid: string, updates: Partial<UserProfile>): Promise<void> => {
  try {
    if (!isFirebaseAvailable || !db) {
      console.warn("Firebase not available, mock profile update")
      return
    }

    await updateDoc(doc(db, "users", uid), {
      ...updates,
      updatedAt: new Date(),
    })
  } catch (error) {
    console.error("Error updating user profile:", error)
    throw new Error("Gagal memperbarui profil. Silakan coba lagi.")
  }
}
