# 🚀 Setup CRUD di Komputer Lokal

Panduan lengkap untuk menjalankan Si-UMKM dengan CRUD yang berfungsi di komputer Anda.

## 📋 Prerequisites

### 1. Software yang Diperlukan
\`\`\`bash
# Node.js (versi 18 atau lebih baru)
node --version  # harus >= 18.0.0
npm --version   # harus >= 8.0.0

# Git
git --version
\`\`\`

### 2. Download & Install
- **Node.js**: https://nodejs.org/
- **Git**: https://git-scm.com/
- **VS Code** (recommended): https://code.visualstudio.com/

## 🔧 Setup Project

### 1. Clone & Install
\`\`\`bash
# Clone project (jika belum)
git clone <repository-url>
cd si-umkm

# Install dependencies
npm install

# Atau jika ada error, gunakan:
npm install --legacy-peer-deps
\`\`\`

### 2. Environment Setup
\`\`\`bash
# Copy environment file
cp .env.example .env.local

# Edit .env.local dengan text editor
\`\`\`

### 3. Environment Variables
Buka `.env.local` dan pastikan ada:
\`\`\`env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_EXPIRES_IN=7d

# Firebase (Optional - untuk production)
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# Development Mode (set to true for demo mode)
NEXT_PUBLIC_DEMO_MODE=true
\`\`\`

## 🚀 Menjalankan Aplikasi

### 1. Start Development Server
\`\`\`bash
# Method 1: Standard
npm run dev

# Method 2: Dengan port khusus
npm run dev -- --port 3001

# Method 3: Dengan turbo (lebih cepat)
npm run dev --turbo
\`\`\`

### 2. Verifikasi Server Berjalan
\`\`\`bash
# Check di browser
http://localhost:3000

# Atau check via curl
curl http://localhost:3000/api/health
\`\`\`

## 🧪 Testing CRUD

### 1. Quick Test (Otomatis)
\`\`\`bash
# Linux/macOS
chmod +x scripts/quick-test.sh
./scripts/quick-test.sh

# Windows
scripts\quick-test.bat
\`\`\`

### 2. Manual Test Steps

#### Step 1: Login Admin
1. Buka: http://localhost:3000/auth/login
2. Pilih tab "Admin"
3. Login dengan:
   - Email: `admin@si-umkm.com`
   - Password: `admin123`

#### Step 2: Test CRUD Operations
1. Buka: http://localhost:3000/admin/products
2. Klik "Add Product" - test CREATE
3. Edit produk yang ada - test UPDATE
4. Lihat daftar produk - test READ
5. Hapus produk - test DELETE

#### Step 3: Debug Page
1. Buka: http://localhost:3000/debug/crud
2. Klik "Run All Tests"
3. Lihat hasil test untuk setiap operasi

## 🔍 Troubleshooting

### Problem 1: Server Tidak Start
\`\`\`bash
# Check port yang digunakan
netstat -an | grep 3000
# atau
lsof -i :3000

# Kill process jika ada
kill -9 $(lsof -t -i:3000)

# Start ulang
npm run dev
\`\`\`

### Problem 2: Dependencies Error
\`\`\`bash
# Clear cache
npm cache clean --force

# Delete node_modules
rm -rf node_modules package-lock.json

# Install ulang
npm install --legacy-peer-deps
\`\`\`

### Problem 3: CRUD Tidak Berfungsi
\`\`\`bash
# Check console browser (F12)
# Lihat Network tab untuk failed requests
# Check localStorage untuk token

# Manual check token
# Buka browser console dan ketik:
localStorage.getItem('admin_token')
localStorage.getItem('token')
\`\`\`

### Problem 4: Authentication Error
\`\`\`bash
# Clear browser storage
# Buka browser console:
localStorage.clear()
sessionStorage.clear()

# Refresh page dan login ulang
\`\`\`

## 🛠️ Development Tools

### 1. Browser Extensions
- **React Developer Tools**
- **Redux DevTools** (jika menggunakan Redux)

### 2. VS Code Extensions
- **ES7+ React/Redux/React-Native snippets**
- **Prettier - Code formatter**
- **ESLint**
- **Auto Rename Tag**

### 3. Debugging Tools
\`\`\`javascript
// Di browser console, untuk debug:
console.log('Auth Status:', {
  hasToken: !!localStorage.getItem('admin_token'),
  role: localStorage.getItem('user_role'),
  isAuthenticated: true
});

// Check API response
fetch('/api/admin/products', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
  }
}).then(r => r.json()).then(console.log);
\`\`\`

## 📱 Testing di Different Browsers

### Chrome/Edge
\`\`\`bash
# Buka dengan specific profile
google-chrome --user-data-dir=/tmp/chrome-dev http://localhost:3000
\`\`\`

### Firefox
\`\`\`bash
firefox -P dev http://localhost:3000
\`\`\`

### Safari (macOS)
\`\`\`bash
open -a Safari http://localhost:3000
\`\`\`

## 🔧 Advanced Configuration

### 1. Custom Port
\`\`\`bash
# .env.local
PORT=3001

# Atau via command
npm run dev -- --port 3001
\`\`\`

### 2. HTTPS Local Development
\`\`\`bash
# Install mkcert
npm install -g mkcert

# Create certificates
mkcert localhost

# Start with HTTPS
npm run dev:https
\`\`\`

### 3. Network Access
\`\`\`bash
# Allow access dari device lain di network
npm run dev -- --host 0.0.0.0
\`\`\`

## 📊 Performance Monitoring

### 1. Check Bundle Size
\`\`\`bash
npm run analyze
\`\`\`

### 2. Check Performance
\`\`\`bash
# Lighthouse audit
npm install -g lighthouse
lighthouse http://localhost:3000 --view
\`\`\`

## 🚨 Common Issues & Solutions

### Issue: "Module not found"
\`\`\`bash
# Solution 1: Install missing package
npm install <package-name>

# Solution 2: Check import paths
# Pastikan path import benar
\`\`\`

### Issue: "Port already in use"
\`\`\`bash
# Solution: Change port
npm run dev -- --port 3001

# Atau kill process
npx kill-port 3000
\`\`\`

### Issue: "Authentication failed"
\`\`\`bash
# Solution: Check JWT_SECRET
# Pastikan JWT_SECRET ada di .env.local
echo $JWT_SECRET  # Linux/macOS
echo %JWT_SECRET% # Windows
\`\`\`

### Issue: "CORS Error"
\`\`\`bash
# Solution: Check next.config.js
# Pastikan CORS configuration benar
\`\`\`

## 📞 Getting Help

### 1. Check Logs
\`\`\`bash
# Server logs
npm run dev

# Browser console (F12)
# Network tab untuk API calls
\`\`\`

### 2. Debug Mode
\`\`\`bash
# Enable debug mode
DEBUG=* npm run dev

# Atau specific debug
DEBUG=api:* npm run dev
\`\`\`

### 3. Community Support
- **GitHub Issues**: Create issue dengan error details
- **Stack Overflow**: Tag dengan `nextjs`, `react`, `crud`
- **Discord/Slack**: Join development community

## ✅ Success Checklist

- [ ] Node.js 18+ installed
- [ ] Dependencies installed successfully
- [ ] .env.local configured
- [ ] Development server starts without errors
- [ ] Can access http://localhost:3000
- [ ] Admin login works (admin@si-umkm.com/admin123)
- [ ] Can access /admin/products
- [ ] CRUD operations work (Create, Read, Update, Delete)
- [ ] Debug page works (/debug/crud)
- [ ] No console errors in browser
- [ ] API calls return expected data

## 🎯 Next Steps

Setelah CRUD berfungsi:
1. **Setup Database**: Ganti mock data dengan real database
2. **Add Authentication**: Implement proper user management
3. **Deploy**: Setup production deployment
4. **Testing**: Add unit dan integration tests
5. **Monitoring**: Setup error tracking dan analytics
\`\`\`

Buat script setup otomatis:
