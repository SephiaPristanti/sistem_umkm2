#!/bin/bash

echo "🔧 Fixing SSR and Client Component Issues..."

# Clear cache and node_modules
echo "📦 Cleaning dependencies..."
rm -rf node_modules package-lock.json .next

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
echo "📥 Reinstalling dependencies..."
npm install --legacy-peer-deps

# Build to check for SSR issues
echo "🏗️ Building application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful! SSR issues fixed."
    echo "🚀 Starting development server..."
    npm run dev
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi
