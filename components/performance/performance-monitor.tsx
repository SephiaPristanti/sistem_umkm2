"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Zap, Clock, Database, Globe } from "lucide-react"

interface PerformanceMetrics {
  renderingMethod: string
  loadTime: number
  cacheStatus: string
  dataFreshness: string
  optimizations: string[]
}

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)

  useEffect(() => {
    // Simulate performance metrics collection
    const collectMetrics = () => {
      const pathname = window.location.pathname
      let renderingMethod = "CSR"
      let cacheStatus = "No Cache"
      let dataFreshness = "Real-time"
      let optimizations: string[] = []

      // Determine rendering method based on route
      if (pathname.startsWith("/products/") && pathname !== "/products") {
        renderingMethod = "SSG"
        cacheStatus = "Static Cache"
        dataFreshness = "Build Time"
        optimizations = ["Static Generation", "Image Optimization", "SEO Optimized"]
      } else if (pathname === "/products") {
        renderingMethod = "ISR"
        cacheStatus = "Revalidated Cache"
        dataFreshness = "60s Stale"
        optimizations = ["Incremental Regeneration", "Background Updates", "Cache Optimization"]
      } else if (pathname.startsWith("/admin")) {
        renderingMethod = "SSR"
        cacheStatus = "No Cache"
        dataFreshness = "Real-time"
        optimizations = ["Server-Side Rendering", "Dynamic Data", "Auth Protected"]
      } else if (pathname === "/profile") {
        renderingMethod = "CSR"
        cacheStatus = "Client Cache"
        dataFreshness = "Real-time"
        optimizations = ["Client-Side Rendering", "Interactive UI", "Real-time Updates"]
      }

      setMetrics({
        renderingMethod,
        loadTime: Math.random() * 500 + 100, // Simulate load time
        cacheStatus,
        dataFreshness,
        optimizations,
      })
    }

    collectMetrics()

    // Update metrics every 5 seconds
    const interval = setInterval(collectMetrics, 5000)

    return () => clearInterval(interval)
  }, [])

  if (!metrics) return null

  const getRenderingColor = (method: string) => {
    switch (method) {
      case "SSG":
        return "bg-green-500 hover:bg-green-600"
      case "ISR":
        return "bg-blue-500 hover:bg-blue-600"
      case "SSR":
        return "bg-orange-500 hover:bg-orange-600"
      case "CSR":
        return "bg-purple-500 hover:bg-purple-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  const getPerformanceScore = () => {
    const baseScore = 100
    const loadTimePenalty = Math.max(0, (metrics.loadTime - 200) / 10)
    return Math.max(0, Math.min(100, baseScore - loadTimePenalty))
  }

  const performanceScore = getPerformanceScore()

  return (
    <div className="fixed bottom-4 right-4 w-80 z-50">
      <Card className="bg-white/95 backdrop-blur border-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center">
              <Zap className="h-4 w-4 mr-2" />
              Performance Monitor
            </CardTitle>
            <Badge className={getRenderingColor(metrics.renderingMethod)}>{metrics.renderingMethod}</Badge>
          </div>
          <CardDescription className="text-xs">Next.js Rendering Optimization</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Performance Score */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Performance Score</span>
              <span className="font-medium">{Math.round(performanceScore)}/100</span>
            </div>
            <Progress
              value={performanceScore}
              className={`h-2 ${performanceScore > 80 ? "text-green-500" : performanceScore > 60 ? "text-yellow-500" : "text-red-500"}`}
            />
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3 text-gray-400" />
                <span className="text-gray-600">Load Time</span>
              </div>
              <p className="font-medium">{Math.round(metrics.loadTime)}ms</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-1">
                <Database className="h-3 w-3 text-gray-400" />
                <span className="text-gray-600">Cache Status</span>
              </div>
              <p className="font-medium">{metrics.cacheStatus}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-1">
                <Globe className="h-3 w-3 text-gray-400" />
                <span className="text-gray-600">Data Freshness</span>
              </div>
              <p className="font-medium">{metrics.dataFreshness}</p>
            </div>

            <div className="space-y-1">
              <span className="text-gray-600">Method</span>
              <p className="font-medium">{metrics.renderingMethod}</p>
            </div>
          </div>

          {/* Optimizations */}
          <div className="space-y-2">
            <p className="text-xs text-gray-600">Active Optimizations:</p>
            <div className="flex flex-wrap gap-1">
              {metrics.optimizations.map((opt, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {opt}
                </Badge>
              ))}
            </div>
          </div>

          {/* Rendering Method Info */}
          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
            {metrics.renderingMethod === "SSG" && "Static Site Generation - Pre-rendered at build time"}
            {metrics.renderingMethod === "ISR" && "Incremental Static Regeneration - Static with periodic updates"}
            {metrics.renderingMethod === "SSR" && "Server-Side Rendering - Rendered on each request"}
            {metrics.renderingMethod === "CSR" && "Client-Side Rendering - Rendered in browser"}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
