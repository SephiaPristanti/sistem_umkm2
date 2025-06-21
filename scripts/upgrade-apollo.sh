#!/bin/bash

echo "🚀 Upgrading Apollo Server to v4..."

# Remove deprecated packages
echo "📦 Removing deprecated packages..."
npm uninstall apollo-server-micro apollo-datasource apollo-server-errors apollo-server-types apollo-server-plugin-base apollo-reporting-protobuf apollo-server-env apollo-server-core subscriptions-transport-ws

# Install modern packages
echo "📦 Installing modern packages..."
npm install @apollo/server@latest graphql-ws@latest

# Clean install
echo "🧹 Clean install..."
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

echo "✅ Apollo Server upgrade completed!"
echo "🎉 No more deprecated warnings!"

# Test the application
echo "🧪 Testing application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "🚀 You can now run: npm run dev"
else
    echo "❌ Build failed. Please check the errors above."
fi
