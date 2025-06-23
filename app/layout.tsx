import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers/providers"
import PerformanceMonitor from "@/components/performance/performance-monitor"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Si-UMKM - Sistem Informasi UMKM",
   metadataBase: new URL("https://projectsiumkm.vercel.app"),
  description: "Platform digital untuk UMKM",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <Providers>
          {children}
          <PerformanceMonitor />
        </Providers>
      </body>
    </html>
  )
}
