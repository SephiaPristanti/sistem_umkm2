"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { Play, Bug, CheckCircle, XCircle } from "lucide-react"

interface TestResult {
  operation: string
  status: "success" | "error" | "pending"
  message: string
  data?: any
}

export default function CRUDTester() {
  const [results, setResults] = useState<TestResult[]>([])
  const [testing, setTesting] = useState(false)
  const [token, setToken] = useState("")

  const addResult = (result: TestResult) => {
    setResults((prev) => [...prev, result])
  }

  const clearResults = () => {
    setResults([])
  }

  const getAuthToken = async () => {
    try {
      addResult({ operation: "Authentication", status: "pending", message: "Logging in..." })

      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "admin@si-umkm.com",
          password: "admin123",
        }),
      })

      if (!response.ok) {
        throw new Error(`Login failed: ${response.status}`)
      }

      const data = await response.json()
      const authToken = data.token

      if (!authToken) {
        throw new Error("No token received")
      }

      setToken(authToken)
      addResult({
        operation: "Authentication",
        status: "success",
        message: "Login successful",
        data: { token: authToken.substring(0, 20) + "..." },
      })

      return authToken
    } catch (error) {
      addResult({
        operation: "Authentication",
        status: "error",
        message: error.message,
      })
      throw error
    }
  }

  const testGetProducts = async (authToken: string) => {
    try {
      addResult({ operation: "GET Products", status: "pending", message: "Fetching products..." })

      const response = await fetch("/api/admin/products", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })

      if (!response.ok) {
        throw new Error(`GET failed: ${response.status}`)
      }

      const data = await response.json()
      addResult({
        operation: "GET Products",
        status: "success",
        message: `Found ${data.products?.length || 0} products`,
        data: data,
      })

      return data
    } catch (error) {
      addResult({
        operation: "GET Products",
        status: "error",
        message: error.message,
      })
      throw error
    }
  }

  const testCreateProduct = async (authToken: string) => {
    try {
      addResult({ operation: "CREATE Product", status: "pending", message: "Creating product..." })

      const testProduct = {
        name: `Test Product ${Date.now()}`,
        description: "This is a test product created by CRUD tester",
        price: 25000,
        originalPrice: 30000,
        category: "Makanan",
        stock: 50,
        businessName: "Test Business",
        location: "Test Location",
      }

      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(testProduct),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`CREATE failed: ${response.status} - ${errorData.error}`)
      }

      const data = await response.json()
      addResult({
        operation: "CREATE Product",
        status: "success",
        message: `Product created with ID: ${data.id}`,
        data: data,
      })

      return data
    } catch (error) {
      addResult({
        operation: "CREATE Product",
        status: "error",
        message: error.message,
      })
      throw error
    }
  }

  const testUpdateProduct = async (authToken: string, productId: number) => {
    try {
      addResult({ operation: "UPDATE Product", status: "pending", message: `Updating product ${productId}...` })

      const updateData = {
        name: `Updated Test Product ${Date.now()}`,
        description: "This product has been updated by CRUD tester",
        price: 35000,
      }

      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`UPDATE failed: ${response.status} - ${errorData.error}`)
      }

      const data = await response.json()
      addResult({
        operation: "UPDATE Product",
        status: "success",
        message: `Product ${productId} updated successfully`,
        data: data,
      })

      return data
    } catch (error) {
      addResult({
        operation: "UPDATE Product",
        status: "error",
        message: error.message,
      })
      throw error
    }
  }

  const testDeleteProduct = async (authToken: string, productId: number) => {
    try {
      addResult({ operation: "DELETE Product", status: "pending", message: `Deleting product ${productId}...` })

      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`DELETE failed: ${response.status} - ${errorData.error}`)
      }

      const data = await response.json()
      addResult({
        operation: "DELETE Product",
        status: "success",
        message: `Product ${productId} deleted successfully`,
        data: data,
      })

      return data
    } catch (error) {
      addResult({
        operation: "DELETE Product",
        status: "error",
        message: error.message,
      })
      throw error
    }
  }

  const runAllTests = async () => {
    setTesting(true)
    clearResults()

    try {
      // Test authentication
      const authToken = await getAuthToken()

      // Test GET
      await testGetProducts(authToken)

      // Test CREATE
      const createdProduct = await testCreateProduct(authToken)

      // Test UPDATE (if product was created)
      if (createdProduct?.id) {
        await testUpdateProduct(authToken, createdProduct.id)

        // Test DELETE (if product was created)
        await testDeleteProduct(authToken, createdProduct.id)
      }

      toast({
        title: "Tests Completed",
        description: "All CRUD operations have been tested",
      })
    } catch (error) {
      toast({
        title: "Test Failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bug className="h-5 w-5" />
            <span>CRUD Operations Tester</span>
          </CardTitle>
          <CardDescription>Test all CRUD operations for products to debug issues</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Button onClick={runAllTests} disabled={testing}>
              <Play className="h-4 w-4 mr-2" />
              {testing ? "Running Tests..." : "Run All Tests"}
            </Button>
            <Button variant="outline" onClick={clearResults}>
              Clear Results
            </Button>
          </div>

          {token && (
            <div className="p-3 bg-green-50 border border-green-200 rounded">
              <Label className="text-sm font-medium text-green-800">Current Token:</Label>
              <p className="text-xs text-green-700 font-mono break-all">{token.substring(0, 50)}...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.map((result, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 border rounded">
                  <div className="flex-shrink-0 mt-0.5">
                    {result.status === "success" && <CheckCircle className="h-4 w-4 text-green-500" />}
                    {result.status === "error" && <XCircle className="h-4 w-4 text-red-500" />}
                    {result.status === "pending" && (
                      <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{result.operation}</span>
                      <span
                        className={`text-sm px-2 py-1 rounded ${
                          result.status === "success"
                            ? "bg-green-100 text-green-800"
                            : result.status === "error"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {result.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{result.message}</p>
                    {result.data && (
                      <details className="mt-2">
                        <summary className="text-xs text-gray-500 cursor-pointer">Show data</summary>
                        <pre className="text-xs bg-gray-50 p-2 rounded mt-1 overflow-auto">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
