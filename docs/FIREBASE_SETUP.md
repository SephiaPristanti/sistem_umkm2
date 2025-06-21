# 🔥 Panduan Setup Firebase untuk Si-UMKM

## 📋 Langkah 1: Buat Project Firebase

### 1.1 Buka Firebase Console
- Kunjungi: https://console.firebase.google.com
- Login dengan akun Google Anda
- Klik **"Create a project"** atau **"Add project"**

### 1.2 Konfigurasi Project
\`\`\`
Project Name: si-umkm-app
Project ID: si-umkm-app-[random-id]
Analytics: Enable (recommended)
\`\`\`

### 1.3 Tunggu Project Dibuat
- Proses biasanya 1-2 menit
- Klik **"Continue"** setelah selesai

## 📋 Langkah 2: Setup Authentication

### 2.1 Enable Authentication
1. Di sidebar kiri, klik **"Authentication"**
2. Klik **"Get started"**
3. Pilih tab **"Sign-in method"**

### 2.2 Enable Sign-in Methods
**Email/Password:**
1. Klik **"Email/Password"**
2. Enable **"Email/Password"**
3. Enable **"Email link (passwordless sign-in)"** (opsional)
4. Klik **"Save"**

**Google Sign-in:**
1. Klik **"Google"**
2. Enable **"Google"**
3. Pilih **"Project support email"**
4. Klik **"Save"**

**Facebook Sign-in (Opsional):**
1. Klik **"Facebook"**
2. Enable **"Facebook"**
3. Masukkan **App ID** dan **App Secret** dari Facebook Developer
4. Klik **"Save"**

### 2.3 Setup Authorized Domains
1. Scroll ke bawah ke **"Authorized domains"**
2. Tambahkan domain Anda:
   - `localhost` (untuk development)
   - `your-domain.com` (untuk production)

## 📋 Langkah 3: Setup Firestore Database

### 3.1 Create Database
1. Di sidebar kiri, klik **"Firestore Database"**
2. Klik **"Create database"**
3. Pilih **"Start in test mode"** (untuk development)
4. Pilih lokasi server (pilih yang terdekat dengan user Anda)
5. Klik **"Done"**

### 3.2 Setup Security Rules
\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Admin can read all users
    match /users/{userId} {
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Public read for products and programs
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    match /programs/{programId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
\`\`\`

## 📋 Langkah 4: Get Configuration

### 4.1 Add Web App
1. Di **Project Overview**, klik ikon **"</>"** (Web)
2. Masukkan **App nickname**: `si-umkm-web`
3. Check **"Also set up Firebase Hosting"** (opsional)
4. Klik **"Register app"**

### 4.2 Copy Configuration
Salin konfigurasi yang muncul:
\`\`\`javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "si-umkm-app-xxxxx.firebaseapp.com",
  projectId: "si-umkm-app-xxxxx",
  storageBucket: "si-umkm-app-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnop"
};
\`\`\`

## 📋 Langkah 5: Setup Environment Variables

### 5.1 Update .env.local
Buat/update file `.env.local` di root project:
\`\`\`env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=si-umkm-app-xxxxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=si-umkm-app-xxxxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=si-umkm-app-xxxxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdefghijklmnop

# JWT Secret for Admin Auth
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
\`\`\`

## 📋 Langkah 6: Setup Admin Users

### 6.1 Create Admin User Manual
1. Buka **Authentication > Users**
2. Klik **"Add user"**
3. Masukkan:
   - Email: `admin@si-umkm.com`
   - Password: `admin123` (ganti dengan password yang kuat)

### 6.2 Add Admin Role di Firestore
1. Buka **Firestore Database**
2. Klik **"Start collection"**
3. Collection ID: `users`
4. Document ID: `[UID dari admin user]`
5. Fields:
\`\`\`json
{
  "uid": "[UID dari admin user]",
  "email": "admin@si-umkm.com",
  "displayName": "Admin Si-UMKM",
  "role": "admin",
  "permissions": ["read:products", "write:products", "read:users", "read:programs", "write:programs"],
  "isEmailVerified": true,
  "createdAt": "[timestamp]",
  "updatedAt": "[timestamp]"
}
\`\`\`

## 📋 Langkah 7: Test Configuration

### 7.1 Restart Development Server
\`\`\`bash
npm run dev
\`\`\`

### 7.2 Test Login
1. Buka http://localhost:3000/auth/login
2. Test login dengan:
   - Email: `admin@si-umkm.com`
   - Password: `admin123`

### 7.3 Test Registration
1. Buka http://localhost:3000/auth/register
2. Daftar dengan email baru
3. Cek di Firebase Console > Authentication

## 🔧 Troubleshooting

### Error: "Firebase configuration not found"
- Pastikan semua environment variables sudah benar
- Restart development server

### Error: "Auth domain not authorized"
- Tambahkan `localhost` di Authorized domains
- Tambahkan domain production Anda

### Error: "Permission denied"
- Cek Firestore security rules
- Pastikan user role sudah benar di Firestore

### Error: "API key not valid"
- Pastikan API key benar dari Firebase Console
- Cek apakah project ID sudah benar

## 🎯 Next Steps

Setelah Firebase berhasil dikonfigurasi:
1. ✅ Test semua fitur login/logout
2. ✅ Setup email verification
3. ✅ Configure password reset
4. ✅ Add more admin users
5. ✅ Setup production environment
\`\`\`

Sekarang mari buat script otomatis untuk setup Firebase:
