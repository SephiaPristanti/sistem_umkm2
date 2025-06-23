// validateEnv.ts

const requiredEnvVars = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
]

const missing = requiredEnvVars.filter((key) => !process.env[key])

if (missing.length > 0) {
  console.error("❌ Missing required environment variables:")
  missing.forEach((key) => console.error(`- ${key}`))
  process.exit(1) // 🔥 Gagalkan build
} else {
  console.log("✅ All required env variables are present")
}
