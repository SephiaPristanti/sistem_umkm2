@echo off
echo 🚀 Si-UMKM Setup Script for Windows
echo ===================================

REM Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)

echo [INFO] Node.js version: 
node --version

REM Check npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed
    pause
    exit /b 1
)

echo [INFO] npm version:
npm --version

REM Install dependencies
echo [STEP] Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

echo [INFO] Dependencies installed successfully

REM Setup environment
echo [STEP] Setting up environment variables...
if not exist ".env.local" (
    if exist ".env.example" (
        copy .env.example .env.local
        echo [INFO] Created .env.local from .env.example
        echo [WARN] Please edit .env.local with your actual configuration values
    ) else (
        echo [WARN] .env.example not found. Creating basic .env.local
        (
            echo # Firebase Configuration
            echo NEXT_PUBLIC_FIREBASE_API_KEY=demo_api_key
            echo NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=demo.firebaseapp.com
            echo NEXT_PUBLIC_FIREBASE_PROJECT_ID=demo-project
            echo NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=demo.appspot.com
            echo NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
            echo NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:demo
            echo.
            echo # JWT Configuration
            echo JWT_SECRET=demo_jwt_secret_key_for_development_only
            echo JWT_EXPIRES_IN=7d
            echo.
            echo # Application Configuration
            echo NODE_ENV=development
            echo PORT=3000
        ) > .env.local
    )
) else (
    echo [INFO] .env.local already exists
)

echo.
echo ✅ Setup completed successfully!
echo.
echo Next steps:
echo 1. Edit .env.local with your Firebase configuration
echo 2. Run 'npm run dev' to start development server
echo 3. Open http://localhost:3000 in your browser
echo.
echo For more information, see README.md
echo.
pause
