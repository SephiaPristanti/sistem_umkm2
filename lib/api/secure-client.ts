import { sanitizeFormData } from "@/lib/security/sanitization"

interface SecureRequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  data?: Record<string, any>
  csrfToken?: string
  sanitize?: boolean
}

/**
 * Secure API client with XSS and CSRF protection
 */
export class SecureApiClient {
  private baseUrl: string
  private csrfToken: string | null = null

  constructor(baseUrl = "/api") {
    this.baseUrl = baseUrl
  }

  /**
   * Set CSRF token for requests
   */
  setCSRFToken(token: string): void {
    this.csrfToken = token
  }

  /**
   * Make a secure API request
   */
  async request<T = any>(endpoint: string, options: SecureRequestOptions = {}): Promise<T> {
    const { method = "GET", data, csrfToken = this.csrfToken, sanitize = true } = options

    const url = `${this.baseUrl}${endpoint}`

    // Sanitize input data if enabled
    const sanitizedData = sanitize && data ? sanitizeFormData(data) : data

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }

    // Add CSRF token for state-changing requests
    if (["POST", "PUT", "DELETE", "PATCH"].includes(method) && csrfToken) {
      headers["X-CSRF-Token"] = csrfToken
    }

    const requestOptions: RequestInit = {
      method,
      headers,
      credentials: "same-origin",
    }

    if (sanitizedData && method !== "GET") {
      requestOptions.body = JSON.stringify(sanitizedData)
    }

    try {
      const response = await fetch(url, requestOptions)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))

        if (response.status === 403 && errorData.code === "CSRF_TOKEN_INVALID") {
          throw new Error("Security token expired. Please refresh the page.")
        }

        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("API request failed:", error)
      throw error
    }
  }

  /**
   * Convenience methods
   */
  async get<T = any>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" })
  }

  async post<T = any>(endpoint: string, data: Record<string, any>): Promise<T> {
    return this.request<T>(endpoint, { method: "POST", data })
  }

  async put<T = any>(endpoint: string, data: Record<string, any>): Promise<T> {
    return this.request<T>(endpoint, { method: "PUT", data })
  }

  async delete<T = any>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" })
  }
}

// Global instance
export const secureApiClient = new SecureApiClient()
