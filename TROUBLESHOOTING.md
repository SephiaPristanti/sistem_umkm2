# 🔧 Troubleshooting Guide - Si-UMKM

## ❌ Common Installation Errors

### 1. ERESOLVE Dependency Conflict

**Error:**
\`\`\`
npm error ERESOLVE unable to resolve dependency tree
npm error Could not resolve dependency: peer date-fns@"^2.28.0 || ^3.0.0"
\`\`\`

**Solutions (try in order):**

#### Solution 1: Automated Fix
\`\`\`bash
# Linux/macOS
chmod +x scripts/fix-dependencies.sh
./scripts/fix-dependencies.sh

# Windows
scripts\fix-dependencies.bat
\`\`\`

#### Solution 2: Manual Fix
\`\`\`bash
# Clean everything
rm -rf node_modules package-lock.json
npm cache clean --force

# Install with legacy peer deps
npm install --legacy-peer-deps
\`\`\`

#### Solution 3: Force Installation
\`\`\`bash
# If solution 2 fails
npm install --force
\`\`\`

#### Solution 4: Use Yarn (Alternative)
\`\`\`bash
# Install Yarn if not installed
npm install -g yarn

# Install dependencies with Yarn
yarn install
\`\`\`

### 2. Port Already in Use

**Error:**
\`\`\`
Error: listen EADDRINUSE: address already in use :::3000
\`\`\`

**Solutions:**
\`\`\`bash
# Find and kill process using port 3000
npx kill-port 3000

# Or use different port
PORT=3001 npm run dev
\`\`\`

### 3. Permission Denied (Linux/macOS)

**Error:**
\`\`\`
Permission denied: ./scripts/setup.sh
\`\`\`

**Solution:**
\`\`\`bash
chmod +x scripts/setup.sh
chmod +x scripts/fix-dependencies.sh
\`\`\`

### 4. Node Version Issues

**Error:**
\`\`\`
The engine "node" is incompatible with this module
\`\`\`

**Solution:**
\`\`\`bash
# Check Node version
node --version

# Should be >= 18.0.0
# If not, install from: https://nodejs.org
\`\`\`

### 5. Firebase Configuration Error

**Error:**
\`\`\`
Firebase: Error (auth/invalid-api-key)
\`\`\`

**Solution:**
1. Check `.env.local` file exists
2. Verify Firebase configuration in Firebase Console
3. Copy correct API keys to `.env.local`

## 🛠️ Quick Fix Commands

\`\`\`bash
# Complete clean reinstall
npm run install:clean

# Force install with legacy deps
npm run install:force

# Check application health
npm run check:health

# Clean development restart
npm run dev:clean
\`\`\`

## 📞 Still Having Issues?

1. **Check Node.js version**: `node --version` (should be >= 18)
2. **Check npm version**: `npm --version` (should be >= 8)
3. **Clear all caches**: `npm cache clean --force`
4. **Try different terminal**: Sometimes Windows PowerShell vs CMD makes a difference
5. **Check antivirus**: Some antivirus software blocks npm operations

## 🔍 Debug Information

Run these commands to gather debug info:

\`\`\`bash
# System info
node --version
npm --version
npm config list

# Project info
npm ls --depth=0
npm outdated
\`\`\`

## 💡 Pro Tips

1. **Use .npmrc**: The project includes `.npmrc` with optimal settings
2. **Legacy peer deps**: This project uses `legacy-peer-deps=true` by default
3. **Clean installs**: When in doubt, clean install: `rm -rf node_modules package-lock.json && npm install`
4. **Use npm scripts**: Use `npm run install:clean` instead of manual commands
