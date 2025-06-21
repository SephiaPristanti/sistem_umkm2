"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { registerWithEmail, signInWithGoogle, signInWithFacebook } from "@/lib/auth/firebase-auth"
import { Eye, EyeOff, Mail, Lock, User, Building, Chrome, Facebook } from "lucide-react"

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
    businessName: "",
    businessType: "",
    businessCategory: "",
    phone: "",
    address: "",
    description: "",
    agreeTerms: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok")
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Password minimal 6 karakter")
      setLoading(false)
      return
    }

    if (!formData.agreeTerms) {
      setError("Anda harus menyetujui syarat dan ketentuan")
      setLoading(false)
      return
    }

    try {
      await registerWithEmail(formData.email, formData.password, {
        displayName: formData.displayName,
        businessName: formData.businessName,
        businessType: formData.businessType,
        businessCategory: formData.businessCategory,
        phone: formData.phone,
        address: formData.address,
        description: formData.description,
      })

      setSuccess("Pendaftaran berhasil! Anda akan diarahkan ke dashboard...")
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (error: any) {
      setError(error.message || "Terjadi kesalahan saat mendaftar")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setLoading(true)
    setError("")

    try {
      await signInWithGoogle()
      router.push("/dashboard")
    } catch (error: any) {
      setError(error.message || "Terjadi kesalahan saat mendaftar dengan Google")
    } finally {
      setLoading(false)
    }
  }

  const handleFacebookSignUp = async () => {
    setLoading(true)
    setError("")

    try {
      await signInWithFacebook()
      router.push("/dashboard")
    } catch (error: any) {
      setError(error.message || "Terjadi kesalahan saat mendaftar dengan Facebook")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Daftar UMKM Baru</h1>
            <p className="text-gray-600">Bergabunglah dengan ribuan UMKM lainnya di platform Si-UMKM</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Informasi Pendaftaran</CardTitle>
              <CardDescription>Lengkapi data berikut untuk mendaftarkan UMKM Anda</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mb-6 border-green-200 bg-green-50">
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}

              {/* OAuth Buttons */}
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" onClick={handleGoogleSignUp} disabled={loading}>
                    <Chrome className="h-4 w-4 mr-2" />
                    Daftar dengan Google
                  </Button>
                  <Button variant="outline" onClick={handleFacebookSignUp} disabled={loading}>
                    <Facebook className="h-4 w-4 mr-2" />
                    Daftar dengan Facebook
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Atau daftar dengan email</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Informasi Pribadi</h3>

                  <div className="space-y-2">
                    <Label htmlFor="displayName">Nama Lengkap *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="displayName"
                        placeholder="Nama lengkap Anda"
                        value={formData.displayName}
                        onChange={(e) => handleInputChange("displayName", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="email@contoh.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Nomor Telepon</Label>
                      <Input
                        id="phone"
                        placeholder="08xxxxxxxxxx"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Minimal 6 karakter"
                          value={formData.password}
                          onChange={(e) => handleInputChange("password", e.target.value)}
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
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Konfirmasi Password *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Ulangi password"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                          className="pl-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Business Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Informasi Usaha</h3>

                  <div className="space-y-2">
                    <Label htmlFor="businessName">Nama Usaha *</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="businessName"
                        placeholder="Contoh: Keripik Mawar Sari"
                        value={formData.businessName}
                        onChange={(e) => handleInputChange("businessName", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="businessType">Jenis Usaha *</Label>
                      <Select onValueChange={(value) => handleInputChange("businessType", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih jenis usaha" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mikro">Usaha Mikro</SelectItem>
                          <SelectItem value="kecil">Usaha Kecil</SelectItem>
                          <SelectItem value="menengah">Usaha Menengah</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="businessCategory">Kategori Usaha *</Label>
                      <Select onValueChange={(value) => handleInputChange("businessCategory", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori usaha" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="makanan">Makanan & Minuman</SelectItem>
                          <SelectItem value="fashion">Fashion & Tekstil</SelectItem>
                          <SelectItem value="kerajinan">Kerajinan Tangan</SelectItem>
                          <SelectItem value="pertanian">Pertanian & Perkebunan</SelectItem>
                          <SelectItem value="teknologi">Teknologi & Digital</SelectItem>
                          <SelectItem value="jasa">Jasa & Layanan</SelectItem>
                          <SelectItem value="lainnya">Lainnya</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Alamat Usaha</Label>
                    <Textarea
                      id="address"
                      placeholder="Alamat lengkap usaha Anda"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Deskripsi Usaha</Label>
                    <Textarea
                      id="description"
                      placeholder="Ceritakan tentang usaha Anda, produk yang dijual, dan keunggulannya..."
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agreeTerms"
                    checked={formData.agreeTerms}
                    onCheckedChange={(checked) => handleInputChange("agreeTerms", checked as boolean)}
                  />
                  <Label htmlFor="agreeTerms" className="text-sm">
                    Saya menyetujui{" "}
                    <a href="/terms" className="text-primary hover:underline">
                      Syarat & Ketentuan
                    </a>{" "}
                    dan{" "}
                    <a href="/privacy" className="text-primary hover:underline">
                      Kebijakan Privasi
                    </a>
                  </Label>
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full" size="lg" disabled={loading || !formData.agreeTerms}>
                  {loading ? "Memproses..." : "Daftar UMKM"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Sudah memiliki akun?{" "}
                  <a href="/auth/login" className="text-primary hover:underline font-medium">
                    Masuk di sini
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
