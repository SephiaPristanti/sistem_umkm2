"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ShoppingBag,
  Bell,
  Package,
  TrendingUp,
  Star,
  Eye,
  Edit,
  Save,
  Camera,
  Mail,
  Phone,
  MapPin,
} from "lucide-react"

interface UserProfileClientProps {
  user: any
  userProfile: any
  profileData: any
}

export default function UserProfileClient({ user, userProfile, profileData }: UserProfileClientProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    displayName: userProfile?.displayName || "",
    businessName: userProfile?.businessName || "",
    phone: userProfile?.phone || "",
    address: userProfile?.address || "",
    description: userProfile?.description || "",
  })

  const handleSave = async () => {
    // Simulate save operation
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setEditMode(false)
    // In real app, update the profile data
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500 hover:bg-green-600"
      case "processing":
        return "bg-blue-500 hover:bg-blue-600"
      case "pending":
        return "bg-yellow-500 hover:bg-yellow-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <ShoppingBag className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-primary">Si-UMKM</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Link href="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={user.photoURL || "/placeholder.svg"} />
                  <AvatarFallback className="text-2xl">
                    {userProfile?.displayName?.[0] || user.email?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button size="sm" variant="outline" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0">
                  <Camera className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">{userProfile?.displayName || "User"}</h1>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Verified
                  </Badge>
                </div>
                <p className="text-gray-600 mb-2">{userProfile?.businessName}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                  {userProfile?.phone && (
                    <div className="flex items-center space-x-1">
                      <Phone className="h-4 w-4" />
                      <span>{userProfile.phone}</span>
                    </div>
                  )}
                  {userProfile?.address && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{userProfile.address}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant={editMode ? "default" : "outline"}
                  onClick={() => (editMode ? handleSave() : setEditMode(true))}
                >
                  {editMode ? <Save className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                  {editMode ? "Simpan" : "Edit Profil"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Ringkasan</TabsTrigger>
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="orders">Pesanan</TabsTrigger>
            <TabsTrigger value="notifications">Notifikasi</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Produk</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{profileData?.statistics.totalProducts}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Penjualan</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{profileData?.statistics.totalSales}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{profileData?.statistics.totalRevenue}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rating Rata-rata</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{profileData?.statistics.averageRating}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Ulasan</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{profileData?.statistics.totalReviews}</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Pesanan Terbaru</CardTitle>
                <CardDescription>Pesanan terbaru dari pelanggan Anda</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profileData?.recentOrders.map((order: any) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">{order.product}</p>
                        <p className="text-sm text-gray-500">Pelanggan: {order.customer}</p>
                        <p className="text-xs text-gray-400">{order.date}</p>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="font-semibold">{order.amount}</p>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status === "completed"
                            ? "Selesai"
                            : order.status === "processing"
                              ? "Diproses"
                              : "Pending"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Profil</CardTitle>
                <CardDescription>Kelola informasi profil dan bisnis Anda</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Nama Lengkap</Label>
                    <Input
                      id="displayName"
                      value={formData.displayName}
                      onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                      disabled={!editMode}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessName">Nama Usaha</Label>
                    <Input
                      id="businessName"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      disabled={!editMode}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={user.email} disabled className="bg-gray-50" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Nomor Telepon</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!editMode}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Alamat</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    disabled={!editMode}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi Usaha</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    disabled={!editMode}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Riwayat Pesanan</CardTitle>
                <CardDescription>Semua pesanan dari pelanggan Anda</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profileData?.recentOrders.map((order: any) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">#{order.id}</p>
                        <p className="text-sm text-gray-600">{order.product}</p>
                        <p className="text-sm text-gray-500">Pelanggan: {order.customer}</p>
                        <p className="text-xs text-gray-400">{order.date}</p>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="font-semibold">{order.amount}</p>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status === "completed"
                            ? "Selesai"
                            : order.status === "processing"
                              ? "Diproses"
                              : "Pending"}
                        </Badge>
                        <div>
                          <Button size="sm" variant="outline">
                            Detail
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notifikasi</CardTitle>
                <CardDescription>Notifikasi terbaru untuk akun Anda</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profileData?.notifications.map((notification: any) => (
                    <div
                      key={notification.id}
                      className={`p-4 border rounded-lg ${!notification.read ? "bg-blue-50 border-blue-200" : ""}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p className="font-medium">{notification.message}</p>
                          <p className="text-xs text-gray-500">{notification.timestamp}</p>
                        </div>
                        {!notification.read && <Badge className="bg-blue-500 hover:bg-blue-600">Baru</Badge>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
