import { Description } from "@radix-ui/react-toast"
import { Bug } from "lucide-react"

import {
  BarChart,
  Building2,
  CheckCircle2,
  LayoutDashboard,
  ListChecks,
  Settings,
  ShoppingCart,
  Users2,
} from "lucide-react"

export const navigationItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    description: "Overview of your platform",
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: BarChart,
    description: "Deep dive into your data",
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: ShoppingCart,
    description: "Manage your products",
  },
 
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ListChecks,
    description: "Track and manage orders",
  },
  {
    name: "Customers",
    href: "/admin/customers",
    icon: Users2,
    description: "Manage your customer base",
  },
  {
    name: "Inventory",
    href: "/admin/inventory",
    icon: Building2,
    description: "Keep track of your stock",
  },
  {
    name: "Fulfillment",
    href: "/admin/fulfillment",
    icon: CheckCircle2,
    description: "Manage order fulfillment",
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
    description: "Configure your platform",
  },
  {
    name: "Debug CRUD",
    href: "/debug/crud",
    icon: Bug,
    description: "Test CRUD operations",
  },
]
