#!/bin/bash

echo "🔍 Debugging CRUD Operations..."

# Check if server is running
echo "Checking server status..."
curl -f http://localhost:3000/api/health || echo "❌ Server not running"

# Test authentication
echo "Testing authentication..."
TOKEN=$(curl -s -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@si-umkm.com","password":"admin123"}' | jq -r '.token')

if [ "$TOKEN" != "null" ] && [ "$TOKEN" != "" ]; then
  echo "✅ Authentication successful"
  echo "Token: ${TOKEN:0:20}..."
else
  echo "❌ Authentication failed"
  exit 1
fi

# Test GET products
echo "Testing GET /api/admin/products..."
curl -s -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/admin/products | jq '.'

# Test POST product
echo "Testing POST /api/admin/products..."
curl -s -X POST http://localhost:3000/api/admin/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Test Product",
    "description": "Test description",
    "price": 10000,
    "category": "Makanan",
    "stock": 100,
    "businessName": "Test Business",
    "location": "Test Location"
  }' | jq '.'

echo "✅ CRUD debugging completed"
