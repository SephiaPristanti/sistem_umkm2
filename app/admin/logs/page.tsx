"use client"

import React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, RefreshCw } from "lucide-react"
import ProtectedRoute from "@/components/auth/protected-route"

interface ApiLog {
  timestamp: string
  method: string
  path: string
  query: Record<string, string>
  ip: string | null
  userAgent: string | null
  responseTime?: number
  statusCode?: number
  error?: string
}

interface LogsResponse {
  logs: ApiLog[]
  pagination: {
    total: number
    page: number
    limit: number
    pages: number
  }
}

export default function ApiLogsPage() {
  return (
    <ProtectedRoute requireAdmin={true} requiredPermissions={["read:logs"]}>
      <ApiLogsContent />
    </ProtectedRoute>
  )
}

function ApiLogsContent() {
  const { adminUser } = useAuth()
  const [logs, setLogs] = useState<ApiLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    pages: 0,
  })

  // Filters
  const [methodFilter, setMethodFilter] = useState<string>("all")
  const [pathFilter, setPathFilter] = useState<string>("")

  const fetchLogs = async () => {
    setLoading(true)
    setError(null)

    try {
      // Build query parameters
      const params = new URLSearchParams()
      params.append("page", pagination.page.toString())
      params.append("limit", pagination.limit.toString())

      if (methodFilter !== "all") {
        params.append("method", methodFilter)
      }

      if (pathFilter) {
        params.append("path", pathFilter)
      }

      // Fetch logs
      const response = await fetch(`/api/admin/logs?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch logs: ${response.status}`)
      }

      const data: LogsResponse = await response.json()
      setLogs(data.logs)
      setPagination(data.pagination)
    } catch (err: any) {
      setError(err.message || "Failed to fetch logs")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (adminUser) {
      fetchLogs()
    }
  }, [adminUser, pagination.page, methodFilter, pathFilter])

  const getStatusColor = (status?: number) => {
    if (!status) return "bg-gray-500"
    if (status >= 500) return "bg-red-500"
    if (status >= 400) return "bg-yellow-500"
    if (status >= 300) return "bg-blue-500"
    return "bg-green-500"
  }

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }))
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">API Request Logs</h1>
        <Button onClick={fetchLogs} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter logs by method, path, or status code</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Select value={methodFilter} onValueChange={setMethodFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Filter by path (e.g., /api/products)"
                  value={pathFilter}
                  onChange={(e) => setPathFilter(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No logs found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Path</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>IP</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-mono text-xs">{new Date(log.timestamp).toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {log.method}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs max-w-xs truncate">{log.path}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(log.statusCode)}>{log.statusCode || "?"}</Badge>
                      </TableCell>
                      <TableCell>{log.responseTime ? `${log.responseTime}ms` : "N/A"}</TableCell>
                      <TableCell className="font-mono text-xs">{log.ip || "Unknown"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page === 1}
              onClick={() => handlePageChange(pagination.page - 1)}
            >
              Previous
            </Button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                .filter((page) => {
                  // Show first page, last page, current page, and pages around current page
                  return page === 1 || page === pagination.pages || Math.abs(page - pagination.page) <= 1
                })
                .map((page, i, arr) => (
                  <React.Fragment key={page}>
                    {i > 0 && arr[i - 1] !== page - 1 && <span className="px-2">...</span>}
                    <Button
                      variant={pagination.page === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  </React.Fragment>
                ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page === pagination.pages}
              onClick={() => handlePageChange(pagination.page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
