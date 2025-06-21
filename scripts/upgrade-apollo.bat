@echo off
echo 🚀 Upgrading Apollo Server to v4...

echo 📦 Removing deprecated packages...
call npm uninstall apollo-server-micro apollo-datasource apollo-server-errors apollo-server-types apollo-server-plugin-base apollo-reporting-protobuf apollo-server-env apollo-server-core subscriptions-transport-ws

echo 📦 Installing modern packages...
call npm install @apollo/server@latest graphql-ws@latest

echo 🧹 Clean install...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
call npm install --legacy-peer-deps

echo ✅ Apollo Server upgrade completed!
echo 🎉 No more deprecated warnings!

echo 🧪 Testing application...
call npm run build

if %errorlevel% equ 0 (
    echo ✅ Build successful!
    echo 🚀 You can now run: npm run dev
) else (
    echo ❌ Build failed. Please check the errors above.
)

pause
