"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LayoutDashboard, Package, Users, Calendar, BarChart3, Settings, LogOut } from "lucide-react"

const navigationItems = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: Package,
    badge: "New",
  },
  {
    name: "UMKM Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Programs",
    href: "/admin/programs",
    icon: Calendar,
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export default function AdminNavigation() {
  const pathname = usePathname()

  return (
    <nav className="w-64 bg-white border-r min-h-screen p-4">
      <div className="space-y-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href}>
              <Button variant={isActive ? "default" : "ghost"} className="w-full justify-start">
                <item.icon className="h-4 w-4 mr-2" />
                {item.name}
                {item.badge && (
                  <Badge variant="secondary" className="ml-auto">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            </Link>
          )
        })}
      </div>

      <div className="absolute bottom-4 left-4 right-4">
        <Button variant="outline" className="w-full justify-start">
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </nav>
  )
}
