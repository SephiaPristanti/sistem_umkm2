"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { type User, onAuthStateChanged } from "firebase/auth"
import { auth, isFirebaseAvailable } from "@/lib/firebase"
import { getUserProfile, type UserProfile } from "@/lib/auth/firebase-auth"
import { verifyJWT, type JWTPayload } from "@/lib/auth/jwt-auth"

interface AuthContextType {
  // Firebase Auth
  user: User | null
  userProfile: UserProfile | null
  loading: boolean

  // Admin Auth
  adminUser: JWTPayload | null
  isAdmin: boolean

  // Firebase availability
  firebaseAvailable: boolean

  // Methods
  setAdminToken: (token: string) => void
  clearAdminToken: () => void
  refreshUserProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [adminUser, setAdminUser] = useState<JWTPayload | null>(null)
  const [mounted, setMounted] = useState(false)

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true)
  }, [])

  // Load admin token from localStorage on mount
  useEffect(() => {
    if (!mounted) return

    const token = localStorage.getItem("admin_token")
    if (token) {
      try {
        const decoded = verifyJWT(token)
        setAdminUser(decoded)
      } catch (error) {
        localStorage.removeItem("admin_token")
      }
    }
  }, [mounted])

  // Listen to Firebase auth state changes
  useEffect(() => {
    if (!mounted || !isFirebaseAvailable || !auth) {
      console.warn("Firebase Auth not available, skipping auth state listener")
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        setUser(firebaseUser)

        if (firebaseUser) {
          try {
            const profile = await getUserProfile(firebaseUser.uid)
            setUserProfile(profile)
          } catch (error) {
            console.error("Error fetching user profile:", error)
            setUserProfile(null)
          }
        } else {
          setUserProfile(null)
        }

        setLoading(false)
      },
      (error) => {
        console.error("Auth state change error:", error)
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [mounted])

  const setAdminToken = (token: string) => {
    if (!mounted) return

    try {
      const decoded = verifyJWT(token)
      setAdminUser(decoded)
      localStorage.setItem("admin_token", token)
    } catch (error) {
      console.error("Invalid admin token:", error)
    }
  }

  const clearAdminToken = () => {
    setAdminUser(null)
    if (mounted) {
      localStorage.removeItem("admin_token")
    }
  }

  const refreshUserProfile = async () => {
    if (user) {
      try {
        const profile = await getUserProfile(user.uid)
        setUserProfile(profile)
      } catch (error) {
        console.error("Error refreshing user profile:", error)
      }
    }
  }

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return null
  }

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    adminUser,
    isAdmin: adminUser !== null && ["admin", "super_admin"].includes(adminUser.role),
    firebaseAvailable: isFirebaseAvailable,
    setAdminToken,
    clearAdminToken,
    refreshUserProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
