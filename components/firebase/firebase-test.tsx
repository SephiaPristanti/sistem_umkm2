"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { isFirebaseAvailable, auth, db } from "@/lib/firebase"
import { signInWithEmail } from "@/lib/auth/firebase-auth"
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from "lucide-react"

export default function FirebaseTest() {
  const [status, setStatus] = useState<{
    firebase: boolean
    auth: boolean
    firestore: boolean
    connection: boolean
  }>({
    firebase: false,
    auth: false,
    firestore: false,
    connection: false,
  })
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<string>("")

  useEffect(() => {
    checkFirebaseStatus()
  }, [])

  const checkFirebaseStatus = () => {
    setStatus({
      firebase: isFirebaseAvailable,
      auth: auth !== null,
      firestore: db !== null,
      connection: isFirebaseAvailable && auth !== null && db !== null,
    })
  }

  const testConnection = async () => {
    setTesting(true)
    setTestResult("")

    try {
      // Test dengan email dummy
      await signInWithEmail("admin@si-umkm.com", "admin123")
      setTestResult("✅ Koneksi Firebase berhasil!")
    } catch (error: any) {
      if (error.message.includes("user-not-found") || error.message.includes("wrong-password")) {
        setTestResult("✅ Koneksi Firebase berhasil! (Error autentikasi normal)")
      } else {
        setTestResult(`❌ Error: ${error.message}`)
      }
    } finally {
      setTesting(false)
    }
  }

  const StatusIcon = ({ status }: { status: boolean }) => {
    return status ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">🔥 Firebase Connection Test</CardTitle>
          <CardDescription>Test koneksi dan konfigurasi Firebase untuk aplikasi Si-UMKM</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status Checks */}
          <div className="space-y-3">
            <h3 className="font-semibold">Status Konfigurasi:</h3>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <StatusIcon status={status.firebase} />
                <span>Firebase Configuration</span>
              </div>
              <Badge variant={status.firebase ? "default" : "destructive"}>
                {status.firebase ? "Configured" : "Not Configured"}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <StatusIcon status={status.auth} />
                <span>Firebase Authentication</span>
              </div>
              <Badge variant={status.auth ? "default" : "destructive"}>
                {status.auth ? "Available" : "Not Available"}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <StatusIcon status={status.firestore} />
                <span>Firestore Database</span>
              </div>
              <Badge variant={status.firestore ? "default" : "destructive"}>
                {status.firestore ? "Available" : "Not Available"}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
              <div className="flex items-center gap-2">
                <StatusIcon status={status.connection} />
                <span className="font-semibold">Overall Status</span>
              </div>
              <Badge variant={status.connection ? "default" : "destructive"}>
                {status.connection ? "Ready" : "Needs Configuration"}
              </Badge>
            </div>
          </div>

          {/* Test Connection */}
          <div className="space-y-3">
            <h3 className="font-semibold">Test Koneksi:</h3>
            <Button onClick={testConnection} disabled={testing || !status.connection} className="w-full">
              {testing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                "Test Firebase Connection"
              )}
            </Button>

            {testResult && (
              <Alert>
                <AlertDescription>{testResult}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Configuration Help */}
          {!status.connection && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Firebase belum dikonfigurasi!</strong>
                <br />
                Silakan ikuti panduan di <code>docs/FIREBASE_SETUP.md</code> atau jalankan:
                <br />
                <code className="bg-gray-100 px-2 py-1 rounded mt-2 inline-block">npm run setup:firebase</code>
              </AlertDescription>
            </Alert>
          )}

          {/* Environment Variables */}
          <div className="space-y-3">
            <h3 className="font-semibold">Environment Variables:</h3>
            <div className="bg-gray-50 p-3 rounded-lg text-sm font-mono">
              <div>FIREBASE_API_KEY: {process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "AIzaSyDW_2RMihHbaOdWqzcq5h2usrVs4ZQ60Gw" : "❌ Not Set"}</div>
              <div>FIREBASE_PROJECT_ID: {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? "si-umkm-app-6c2c3" : "❌ Not Set"}</div>
              <div>FIREBASE_AUTH_DOMAIN: {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? "si-umkm-app-6c2c3.firebaseapp.com" : "❌ Not Set"}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
