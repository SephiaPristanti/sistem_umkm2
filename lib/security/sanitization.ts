import DOMPurify from "isomorphic-dompurify"

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export function sanitizeHtml(dirty: string): string {
  if (!dirty || typeof dirty !== "string") {
    return ""
  }

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p", "br", "ul", "ol", "li"],
    ALLOWED_ATTR: ["href", "target"],
    ALLOW_DATA_ATTR: false,
    FORBID_SCRIPT: true,
    FORBID_TAGS: ["script", "object", "embed", "form", "input", "iframe"],
    FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover", "onfocus", "onblur"],
  })
}

/**
 * Sanitize plain text input to prevent XSS
 */
export function sanitizeText(input: string): string {
  if (!input || typeof input !== "string") {
    return ""
  }

  return input
    .replace(/[<>]/g, "") // Remove < and > characters
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, "") // Remove event handlers
    .trim()
}

/**
 * Sanitize email input
 */
export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== "string") {
    return ""
  }

  return email
    .toLowerCase()
    .replace(/[^a-z0-9@._-]/g, "")
    .trim()
}

/**
 * Sanitize URL input
 */
export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== "string") {
    return ""
  }

  // Only allow http and https protocols
  const allowedProtocols = ["http:", "https:"]

  try {
    const urlObj = new URL(url)
    if (!allowedProtocols.includes(urlObj.protocol)) {
      return ""
    }
    return urlObj.toString()
  } catch {
    return ""
  }
}

/**
 * Sanitize phone number input
 */
export function sanitizePhone(phone: string): string {
  if (!phone || typeof phone !== "string") {
    return ""
  }

  return phone.replace(/[^0-9+\-\s()]/g, "").trim()
}

/**
 * Validate and sanitize file names
 */
export function sanitizeFileName(fileName: string): string {
  if (!fileName || typeof fileName !== "string") {
    return ""
  }

  return fileName
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/\.{2,}/g, ".")
    .substring(0, 255)
}

/**
 * Escape special characters for SQL-like queries
 */
export function escapeSqlLike(input: string): string {
  if (!input || typeof input !== "string") {
    return ""
  }

  return input.replace(/[%_\\]/g, "\\$&").replace(/'/g, "''")
}

/**
 * Comprehensive input sanitizer for form data
 */
export function sanitizeFormData(data: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {}

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === "string") {
      // Apply appropriate sanitization based on field type
      if (key.toLowerCase().includes("email")) {
        sanitized[key] = sanitizeEmail(value)
      } else if (key.toLowerCase().includes("url") || key.toLowerCase().includes("website")) {
        sanitized[key] = sanitizeUrl(value)
      } else if (key.toLowerCase().includes("phone")) {
        sanitized[key] = sanitizePhone(value)
      } else if (key.toLowerCase().includes("description") || key.toLowerCase().includes("content")) {
        sanitized[key] = sanitizeHtml(value)
      } else {
        sanitized[key] = sanitizeText(value)
      }
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((item) => (typeof item === "string" ? sanitizeText(item) : item))
    } else {
      sanitized[key] = value
    }
  }

  return sanitized
}
