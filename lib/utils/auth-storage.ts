/**
 * Authentication Storage Utility
 * Handles token storage and retrieval for different user roles
 */

export class AuthStorage {
  private static readonly TOKEN_KEY = "token"
  private static readonly ADMIN_TOKEN_KEY = "admin_token"
  private static readonly ROLE_KEY = "user_role"

  /**
   * Set authentication token
   */
  static setToken(token: string, role: "admin" | "umkm" = "umkm"): void {
    try {
      if (typeof window === "undefined") return

      const tokenKey = role === "admin" ? this.ADMIN_TOKEN_KEY : this.TOKEN_KEY

      localStorage.setItem(tokenKey, token)
      localStorage.setItem(this.ROLE_KEY, role)

      console.log(`✅ Token stored for role: ${role}`, {
        tokenKey,
        tokenLength: token.length,
        role,
      })
    } catch (error) {
      console.error("❌ Error storing token:", error)
    }
  }

  /**
   * Get authentication token
   */
  static getToken(role?: "admin" | "umkm"): string | null {
    try {
      if (typeof window === "undefined") return null

      // If role is specified, get token for that role
      if (role) {
        const tokenKey = role === "admin" ? this.ADMIN_TOKEN_KEY : this.TOKEN_KEY
        return localStorage.getItem(tokenKey)
      }

      // Otherwise, get token based on stored role
      const storedRole = this.getRole()
      if (storedRole === "admin") {
        return localStorage.getItem(this.ADMIN_TOKEN_KEY)
      } else {
        return localStorage.getItem(this.TOKEN_KEY)
      }
    } catch (error) {
      console.error("❌ Error getting token:", error)
      return null
    }
  }

  /**
   * Get user role
   */
  static getRole(): "admin" | "umkm" | null {
    try {
      if (typeof window === "undefined") return null
      return localStorage.getItem(this.ROLE_KEY) as "admin" | "umkm" | null
    } catch (error) {
      console.error("❌ Error getting role:", error)
      return null
    }
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    const token = this.getToken()
    const isAuth = !!token

    console.log("🔍 Authentication check:", {
      hasToken: isAuth,
      role: this.getRole(),
      tokenLength: token?.length || 0,
    })

    return isAuth
  }

  /**
   * Check if user is admin
   */
  static isAdmin(): boolean {
    const role = this.getRole()
    const adminToken = this.getToken("admin")
    return role === "admin" && !!adminToken
  }

  /**
   * Clear all authentication data
   */
  static clearAuth(): void {
    try {
      if (typeof window === "undefined") return

      localStorage.removeItem(this.TOKEN_KEY)
      localStorage.removeItem(this.ADMIN_TOKEN_KEY)
      localStorage.removeItem(this.ROLE_KEY)

      console.log("🧹 Authentication data cleared")
    } catch (error) {
      console.error("❌ Error clearing auth data:", error)
    }
  }

  /**
   * Get authorization header for API requests
   */
  static getAuthHeader(): Record<string, string> {
    const token = this.getToken()

    if (!token) {
      console.warn("⚠️ No token available for auth header")
      return {}
    }

    return {
      Authorization: `Bearer ${token}`,
    }
  }

  /**
   * Debug information
   */
  static getDebugInfo(): Record<string, any> {
    return {
      hasToken: this.isAuthenticated(),
      role: this.getRole(),
      isAdmin: this.isAdmin(),
      tokenLength: this.getToken()?.length || 0,
      adminTokenLength: this.getToken("admin")?.length || 0,
      umkmTokenLength: this.getToken("umkm")?.length || 0,
    }
  }
}
