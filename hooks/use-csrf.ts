"use client"

import { useState, useEffect } from "react"

interface CSRFHook {
  csrfToken: string | null
  loading: boolean
  error: string | null
  refreshToken: () => Promise<void>
}

export function useCSRF(): CSRFHook {
  const [csrfToken, setCSRFToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCSRFToken = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/csrf-token", {
        method: "GET",
        credentials: "same-origin",
      })

      if (!response.ok) {
        throw new Error("Failed to fetch CSRF token")
      }

      const data = await response.json()
      setCSRFToken(data.csrfToken)
    } catch (err: any) {
      setError(err.message || "Failed to fetch CSRF token")
      setCSRFToken(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCSRFToken()
  }, [])

  return {
    csrfToken,
    loading,
    error,
    refreshToken: fetchCSRFToken,
  }
}
