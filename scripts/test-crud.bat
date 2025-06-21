@echo off
echo 🧪 Testing CRUD Operations for Si-UMKM Products
echo ==============================================

set BASE_URL=http://localhost:3000

echo 1. Testing Admin Login...
curl -s -X POST "%BASE_URL%/api/users/login" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@si-umkm.com\",\"password\":\"admin123\"}"

echo.
echo 2. Testing Get All Products...
curl -s -X GET "%BASE_URL%/api/admin/products" ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

echo.
echo 3. Testing Create Product...
curl -s -X POST "%BASE_URL%/api/admin/products" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE" ^
  -d "{\"name\":\"Test Product\",\"description\":\"Test description\",\"price\":25000,\"category\":\"Makanan\",\"stock\":100,\"businessId\":1,\"businessName\":\"Test Business\",\"location\":\"Jakarta\"}"

echo.
echo ✅ CRUD Testing Complete!
echo Access the dashboards:
echo - Admin: http://localhost:3000/admin/products
echo - UMKM: http://localhost:3000/umkm/products
pause
