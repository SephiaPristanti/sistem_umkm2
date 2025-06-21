@echo off
echo 🔍 Debugging CRUD Operations...

echo Checking server status...
curl -f http://localhost:3000/api/health
if %errorlevel% neq 0 (
    echo ❌ Server not running
    exit /b 1
)

echo Testing authentication...
curl -s -X POST http://localhost:3000/api/users/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@si-umkm.com\",\"password\":\"admin123\"}" > temp_auth.json

echo Testing GET products...
curl -s -H "Authorization: Bearer TOKEN_HERE" ^
  http://localhost:3000/api/admin/products

echo ✅ CRUD debugging completed
del temp_auth.json
