"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { signInWithEmail, signInWithGoogle, signInWithFacebook } from "@/lib/auth/firebase-auth"
import { adminLogin } from "@/lib/auth/jwt-auth"
import { useAuth } from "@/contexts/auth-context"
import { AuthStorage } from "@/lib/utils/auth-storage"
import { Eye, EyeOff, Mail, Lock, Chrome, Facebook, Shield, AlertTriangle, Info } from "lucide-react"
import { app } from "@/lib/firebase";


export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { setAdminToken, firebaseAvailable } = useAuth()

  // User login form state
  const [userForm, setUserForm] = useState({
    email: "",
    password: "",
  })

  // Admin login form state
  const [adminForm, setAdminForm] = useState({
    email: "admin@si-umkm.com",
    password: "admin123",
  })

  const handleUserLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      console.log("🔐 Attempting user login:", userForm.email)

      if (firebaseAvailable) {
        await signInWithEmail(userForm.email, userForm.password)
        console.log("✅ Firebase login successful")
      } else {
        // Demo mode - simulate login
        console.log("🎭 Demo mode login")
        const demoToken = "demo-user-token-" + Date.now()
        AuthStorage.setToken(demoToken, "umkm")
      }

      router.push("/dashboard")
    } catch (error: any) {
      console.error("❌ User login error:", error)
      setError(error.message || "Terjadi kesalahan saat login")
    } finally {
      setLoading(false)
    }
  }

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      console.log("🔐 Attempting admin login:", adminForm.email)

      const { token } = await adminLogin(adminForm.email, adminForm.password)

      // Store token using AuthStorage
      AuthStorage.setToken(token, "admin")
      setAdminToken(token)

      console.log("✅ Admin login successful, token stored:", {
        tokenExists: !!token,
        isAuthenticated: AuthStorage.isAuthenticated(),
        role: AuthStorage.getRole(),
      })

      router.push("/admin")
    } catch (error: any) {
      console.error("❌ Admin login error:", error)
      setError(error.message || "Terjadi kesalahan saat login admin")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError("")

    try {
      console.log("🔐 Attempting Google login")

      if (firebaseAvailable) {
        await signInWithGoogle()
        console.log("✅ Google login successful")
      } else {
        // Demo mode
        console.log("🎭 Demo Google login")
        const demoToken = "demo-google-token-" + Date.now()
        AuthStorage.setToken(demoToken, "umkm")
      }

      router.push("/dashboard")
    } catch (error: any) {
      console.error("❌ Google login error:", error)
      setError(error.message || "Terjadi kesalahan saat login dengan Google")
    } finally {
      setLoading(false)
    }
  }

  const handleFacebookLogin = async () => {
    setLoading(true)
    setError("")

    try {
      console.log("🔐 Attempting Facebook login")

      if (firebaseAvailable) {
        await signInWithFacebook()
        console.log("✅ Facebook login successful")
      } else {
        // Demo mode
        console.log("🎭 Demo Facebook login")
        const demoToken = "demo-facebook-token-" + Date.now()
        AuthStorage.setToken(demoToken, "umkm")
      }

      router.push("/dashboard")
    } catch (error: any) {
      console.error("❌ Facebook login error:", error)
      setError(error.message || "Terjadi kesalahan saat login dengan Facebook")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Masuk ke Si-UMKM</h2>
          <p className="mt-2 text-sm text-gray-600">Pilih jenis akun untuk melanjutkan</p>
        </div>

        {/* Debug Info */}
        <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
          <strong>Debug Info:</strong>
          <br />
          Firebase: {firebaseAvailable ? "✅ Available" : "❌ Not configured"}
          <br />
          Auth Storage: {AuthStorage.isAuthenticated() ? "✅ Token exists" : "❌ No token"}
          <br />
          Current Role: {AuthStorage.getRole() || "None"}
        </div>

        {/* Firebase Status Notice */}
        {!firebaseAvailable && (
          <Alert className="border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Mode Demo:</strong> Firebase tidak dikonfigurasi. Sistem berjalan dalam mode demonstrasi. Gunakan
              email/password apa saja untuk login UMKM.
            </AlertDescription>
          </Alert>
        )}

        {/* Demo Notice for Admin */}
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Admin Demo:</strong> Untuk akses admin, gunakan: admin@si-umkm.com / admin123
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="user" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="user">UMKM</TabsTrigger>
            <TabsTrigger value="admin">
              <Shield className="h-4 w-4 mr-2" />
              Admin
            </TabsTrigger>
          </TabsList>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <TabsContent value="user">
            <Card>
              <CardHeader>
                <CardTitle>Login UMKM</CardTitle>
                <CardDescription>
                  {firebaseAvailable ? "Masuk dengan akun UMKM Anda" : "Mode demo - gunakan email/password apa saja"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleUserLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="user-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="user-email"
                        type="email"
                        placeholder={firebaseAvailable ? "email@contoh.com" : "demo@example.com (atau email apa saja)"}
                        value={userForm.email}
                        onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="user-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="user-password"
                        type={showPassword ? "text" : "password"}
                        placeholder={firebaseAvailable ? "Password" : "password123 (atau password apa saja)"}
                        value={userForm.password}
                        onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Memproses..." : "Masuk"}
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Atau masuk dengan</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" onClick={handleGoogleLogin} disabled={loading}>
                    <Chrome className="h-4 w-4 mr-2" />
                    Google
                  </Button>
                  <Button variant="outline" onClick={handleFacebookLogin} disabled={loading}>
                    <Facebook className="h-4 w-4 mr-2" />
                    Facebook
                  </Button>
                </div>

                {!firebaseAvailable && (
                  <div className="text-xs text-gray-500 text-center">OAuth login akan menggunakan akun demo</div>
                )}

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Belum memiliki akun?{" "}
                    <a href="/auth/register" className="text-primary hover:underline font-medium">
                      Daftar di sini
                    </a>
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    <a href="/auth/forgot-password" className="text-primary hover:underline">
                      Lupa password?
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admin">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Login Admin
                </CardTitle>
                <CardDescription>Masuk dengan akun administrator</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Email Admin</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="admin-email"
                        type="email"
                        placeholder="admin@si-umkm.com"
                        value={adminForm.email}
                        onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Password Admin</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="admin-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="admin123"
                        value={adminForm.password}
                        onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Memproses..." : "Masuk sebagai Admin"}
                  </Button>
                </form>

                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-xs text-yellow-800">
                    <strong>Demo Credentials:</strong>
                    <br />
                    Email: admin@si-umkm.com
                    <br />
                    Password: admin123
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
