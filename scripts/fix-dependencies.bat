@echo off
echo 🔧 Fixing dependency conflicts...

echo Step 1: Cleaning existing installations...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
if exist yarn.lock del yarn.lock

echo Step 2: Clearing npm cache...
npm cache clean --force

echo Step 3: Installing with legacy peer deps...
npm install --legacy-peer-deps

if %errorlevel% equ 0 (
    echo ✅ Dependencies installed successfully!
    echo You can now run: npm run dev
) else (
    echo ❌ Installation failed. Trying alternative method...
    
    echo Step 4: Trying with --force flag...
    npm install --force
    
    if %errorlevel% equ 0 (
        echo ✅ Dependencies installed with --force!
        echo ⚠️  Warning: Some peer dependencies may not be optimal
    ) else (
        echo ❌ Installation still failed. Please check the error log.
        pause
        exit /b 1
    )
)

echo 🎉 Setup complete! Run 'npm run dev' to start the application.
pause
