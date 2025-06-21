@echo off
echo 🔧 Fixing SSR and Client Component Issues...

echo 📦 Cleaning dependencies...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
if exist .next rmdir /s /q .next

echo 📥 Clearing npm cache...
npm cache clean --force

echo 📥 Reinstalling dependencies...
npm install --legacy-peer-deps

echo 🏗️ Building application...
npm run build

if %errorlevel% equ 0 (
    echo ✅ Build successful! SSR issues fixed.
    echo 🚀 Starting development server...
    npm run dev
) else (
    echo ❌ Build failed. Please check the errors above.
    pause
    exit /b 1
)
