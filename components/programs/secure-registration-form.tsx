"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useCSRF } from "@/hooks/use-csrf"
import { secureApiClient } from "@/lib/api/secure-client"
import { sanitizeText, sanitizeEmail } from "@/lib/security/sanitization"
import { Shield, CheckCircle, AlertTriangle } from "lucide-react"

interface ProgramRegistrationFormProps {
  programId: string
  programTitle: string
  onSuccess?: () => void
}

export default function SecureProgramRegistrationForm({
  programId,
  programTitle,
  onSuccess,
}: ProgramRegistrationFormProps) {
  const { csrfToken, loading: csrfLoading, error: csrfError } = useCSRF()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    phone: "",
    businessName: "",
    motivation: "",
  })

  // Real-time input sanitization
  const handleInputChange = (field: string, value: string) => {
    let sanitizedValue = value

    switch (field) {
      case "userEmail":
        sanitizedValue = sanitizeEmail(value)
        break
      case "userName":
      case "businessName":
        sanitizedValue = sanitizeText(value)
        break
      case "phone":
        sanitizedValue = value.replace(/[^0-9+\-\s()]/g, "")
        break
      case "motivation":
        // Allow more characters for motivation but still sanitize
        sanitizedValue = value.replace(/[<>]/g, "").substring(0, 500)
        break
      default:
        sanitizedValue = sanitizeText(value)
    }

    setFormData((prev) => ({
      ...prev,
      [field]: sanitizedValue,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!csrfToken) {
      setError("Security token not available. Please refresh the page.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Set CSRF token for the request
      secureApiClient.setCSRFToken(csrfToken)

      // Submit registration with automatic sanitization
      await secureApiClient.post(`/programs/${programId}/register`, formData)

      setSuccess(true)
      onSuccess?.()
    } catch (err: any) {
      setError(err.message || "Failed to register for program")
    } finally {
      setLoading(false)
    }
  }

  if (csrfLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <Shield className="h-8 w-8 animate-pulse mx-auto mb-2 text-primary" />
            <p className="text-gray-600">Initializing security...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (csrfError) {
    return (
      <Card>
        <CardContent className="py-8">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>Security initialization failed. Please refresh the page.</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  if (success) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Registration Successful!</h3>
            <p className="text-gray-600">
              You have been successfully registered for "{programTitle}". You will receive a confirmation email shortly.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 mr-2 text-primary" />
          Register for Program
        </CardTitle>
        <CardDescription>Secure registration for "{programTitle}"</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="userName">Full Name *</Label>
              <Input
                id="userName"
                value={formData.userName}
                onChange={(e) => handleInputChange("userName", e.target.value)}
                placeholder="Your full name"
                required
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="userEmail">Email Address *</Label>
              <Input
                id="userEmail"
                type="email"
                value={formData.userEmail}
                onChange={(e) => handleInputChange("userEmail", e.target.value)}
                placeholder="your.email@example.com"
                required
                maxLength={255}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+62 812-3456-7890"
                maxLength={20}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                value={formData.businessName}
                onChange={(e) => handleInputChange("businessName", e.target.value)}
                placeholder="Your business name"
                maxLength={100}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="motivation">Why do you want to join this program?</Label>
            <Textarea
              id="motivation"
              value={formData.motivation}
              onChange={(e) => handleInputChange("motivation", e.target.value)}
              placeholder="Tell us about your motivation and what you hope to achieve..."
              rows={4}
              maxLength={500}
            />
            <div className="text-xs text-gray-500 text-right">{formData.motivation.length}/500 characters</div>
          </div>

          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <Shield className="h-3 w-3" />
            <span>This form is protected against XSS and CSRF attacks</span>
          </div>

          <Button type="submit" className="w-full" disabled={loading || !formData.userName || !formData.userEmail}>
            {loading ? "Registering..." : "Register for Program"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
