@echo off
echo 🚀 Si-UMKM Local Setup Script
echo ==============================

:: Check Node.js
echo [INFO] Checking prerequisites...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found. Please install Node.js 18+: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [SUCCESS] Node.js found: %NODE_VERSION%

:: Check npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm not found. Please install npm.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo [SUCCESS] npm found: %NPM_VERSION%

:: Check package.json
if not exist "package.json" (
    echo [ERROR] package.json not found. Please run this script from the project root directory.
    pause
    exit /b 1
)

echo [SUCCESS] Prerequisites check passed!

:: Install dependencies
echo [INFO] Installing dependencies...
npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies. Trying alternative method...
    
    echo [INFO] Clearing npm cache...
    npm cache clean --force
    
    echo [INFO] Removing node_modules...
    if exist "node_modules" rmdir /s /q node_modules
    if exist "package-lock.json" del package-lock.json
    
    echo [INFO] Reinstalling dependencies...
    npm install --legacy-peer-deps
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install dependencies. Please check your internet connection.
        pause
        exit /b 1
    )
)

echo [SUCCESS] Dependencies installed successfully!

:: Setup environment file
echo [INFO] Setting up environment file...
if not exist ".env.local" (
    if exist ".env.example" (
        copy .env.example .env.local
        echo [SUCCESS] Created .env.local from .env.example
    ) else (
        echo # JWT Configuration > .env.local
        echo JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random-%RANDOM% >> .env.local
        echo JWT_EXPIRES_IN=7d >> .env.local
        echo. >> .env.local
        echo # Demo Mode >> .env.local
        echo NEXT_PUBLIC_DEMO_MODE=true >> .env.local
        echo. >> .env.local
        echo # Firebase (Optional) >> .env.local
        echo NEXT_PUBLIC_FIREBASE_API_KEY= >> .env.local
        echo NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN= >> .env.local
        echo NEXT_PUBLIC_FIREBASE_PROJECT_ID= >> .env.local
        echo NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET= >> .env.local
        echo NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID= >> .env.local
        echo NEXT_PUBLIC_FIREBASE_APP_ID= >> .env.local
        echo [SUCCESS] Created basic .env.local file
    )
) else (
    echo [WARNING] .env.local already exists, skipping...
)

:: Build project
echo [INFO] Building the project...
npm run build
if %errorlevel% neq 0 (
    echo [WARNING] Build failed, but you can still run in development mode.
)

:: Final instructions
echo.
echo 🎉 Setup completed successfully!
echo.
echo 📋 Next steps:
echo 1. Start the development server:
echo    npm run dev
echo.
echo 2. Open your browser and go to:
echo    http://localhost:3000
echo.
echo 3. Login as admin:
echo    Email: admin@si-umkm.com
echo    Password: admin123
echo.
echo 4. Test CRUD operations:
echo    - Go to: http://localhost:3000/admin/products
echo    - Or debug page: http://localhost:3000/debug/crud
echo.
echo 🔧 Troubleshooting:
echo    - If port 3000 is busy: npm run dev -- --port 3001
echo    - If dependencies fail: rmdir /s node_modules ^&^& npm install
echo    - Check logs in browser console (F12)
echo.
echo 📚 Documentation: docs\LOCAL_SETUP.md
echo.

:: Ask if user wants to start the server
set /p choice="Do you want to start the development server now? (y/n): "
if /i "%choice%"=="y" (
    echo [INFO] Starting development server...
    npm run dev
)

pause
