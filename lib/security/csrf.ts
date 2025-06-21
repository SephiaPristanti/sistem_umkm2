import { randomBytes, createHash } from "crypto"

/**
 * Generate a CSRF token
 */
export function generateCSRFToken(): string {
  return randomBytes(32).toString("hex")
}

/**
 * Create a hash of the CSRF token for storage
 */
export function hashCSRFToken(token: string): string {
  return createHash("sha256").update(token).digest("hex")
}

/**
 * Verify CSRF token
 */
export function verifyCSRFToken(token: string, hashedToken: string): boolean {
  if (!token || !hashedToken) {
    return false
  }

  const tokenHash = hashCSRFToken(token)
  return tokenHash === hashedToken
}

/**
 * CSRF token store (in production, use Redis or database)
 */
class CSRFTokenStore {
  private tokens = new Map<string, { hash: string; expires: number }>()
  private readonly TOKEN_EXPIRY = 60 * 60 * 1000 // 1 hour

  store(sessionId: string, tokenHash: string): void {
    this.tokens.set(sessionId, {
      hash: tokenHash,
      expires: Date.now() + this.TOKEN_EXPIRY,
    })
  }

  verify(sessionId: string, token: string): boolean {
    const stored = this.tokens.get(sessionId)

    if (!stored) {
      return false
    }

    // Check if token is expired
    if (Date.now() > stored.expires) {
      this.tokens.delete(sessionId)
      return false
    }

    return verifyCSRFToken(token, stored.hash)
  }

  cleanup(): void {
    const now = Date.now()
    for (const [sessionId, data] of this.tokens.entries()) {
      if (now > data.expires) {
        this.tokens.delete(sessionId)
      }
    }
  }
}

export const csrfStore = new CSRFTokenStore()

// Cleanup expired tokens every 30 minutes
if (typeof window === "undefined") {
  setInterval(
    () => {
      csrfStore.cleanup()
    },
    30 * 60 * 1000,
  )
}
