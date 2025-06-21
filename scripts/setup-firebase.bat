@echo off
echo 🔥 Firebase Setup Script untuk Si-UMKM
echo ======================================

echo 📋 Langkah 1: Cek Environment Variables

REM Check if .env.local exists
if not exist ".env.local" (
    echo ⚠️  File .env.local tidak ditemukan. Membuat dari template...
    copy .env.example .env.local
    echo ✅ File .env.local berhasil dibuat
) else (
    echo ✅ File .env.local sudah ada
)

echo.
echo 📋 Langkah 2: Validasi Firebase Configuration
echo 📖 Silakan pastikan .env.local sudah dikonfigurasi dengan benar
echo 🔗 Panduan lengkap: docs/FIREBASE_SETUP.md
echo 🔗 Firebase Console: https://console.firebase.google.com

echo.
echo 📋 Langkah 3: Install Firebase CLI (Opsional)
firebase --version 2>nul
if %errorlevel% neq 0 (
    echo ⚠️  Firebase CLI belum terinstall
    echo 💡 Install dengan: npm install -g firebase-tools
) else (
    echo ✅ Firebase CLI sudah terinstall
)

echo.
echo 📋 Langkah 4: Test Firebase Connection
echo 🔨 Testing build...
npm run build >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Build gagal. Cek konfigurasi Firebase
    pause
    exit /b 1
) else (
    echo ✅ Build berhasil
)

echo.
echo 📋 Langkah 5: Start Development Server
echo 🚀 Menjalankan development server...
echo 📖 Buka browser di: http://localhost:3000
echo 🔐 Test login di: http://localhost:3000/auth/login

REM Start dev server
npm run dev
