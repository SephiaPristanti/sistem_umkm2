# Si-UMKM - Sistem Informasi UMKM

Aplikasi Next.js untuk manajemen UMKM dengan fitur lengkap termasuk autentikasi, manajemen produk, dan program pelatihan.

## 📋 Prerequisites

Pastikan Anda sudah menginstall:

- **Node.js** (versi 18 atau lebih baru)
- **npm** atau **yarn**
- **Git**
- **Docker** (opsional, untuk containerization)

### Cek Versi yang Terinstall

\`\`\`bash
node --version    # Harus >= 18.0.0
npm --version     # Harus >= 8.0.0
git --version     # Versi terbaru
docker --version  # Opsional
\`\`\`

## 🚀 Cara Menjalankan di Komputer Sendiri

### Metode 1: Instalasi Manual (Recommended untuk Development)

#### 1. Clone Repository

\`\`\`bash
# Clone project (jika dari Git)
git clone <repository-url>
cd si-umkm

# Atau download dan extract ZIP file
\`\`\`

#### 2. Install Dependencies

\`\`\`bash
# Menggunakan npm
npm install

# Atau menggunakan yarn
yarn install
\`\`\`

#### 3. Setup Environment Variables

\`\`\`bash
# Copy file environment template
cp .env.example .env.local

# Edit file .env.local dengan text editor favorit Anda
nano .env.local
# atau
code .env.local
\`\`\`

#### 4. Jalankan Development Server

\`\`\`bash
# Menggunakan npm
npm run dev

# Atau menggunakan yarn
yarn dev
\`\`\`

#### 5. Buka Browser

Aplikasi akan berjalan di: **http://localhost:3000**

### Metode 2: Menggunakan Docker (Recommended untuk Production)

#### 1. Install Docker

- **Windows**: Download Docker Desktop dari https://docker.com
- **macOS**: Download Docker Desktop dari https://docker.com  
- **Linux**: Install menggunakan package manager

#### 2. Jalankan dengan Docker Compose

\`\`\`bash
# Development mode
npm run docker:compose:up

# Production mode
npm run docker:compose:prod
\`\`\`

#### 3. Akses Aplikasi

- **Development**: http://localhost:3000
- **Production**: http://localhost (port 80)

## 🔧 Konfigurasi Environment Variables

Buat file `.env.local` dengan konfigurasi berikut:

\`\`\`env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Application Configuration
NODE_ENV=development
\`\`\`

## 📱 Fitur Aplikasi

- ✅ **Autentikasi**: Login/Register dengan Firebase
- ✅ **Manajemen Produk**: CRUD produk UMKM
- ✅ **Program Pelatihan**: Pendaftaran dan manajemen program
- ✅ **Dashboard Admin**: Panel administrasi
- ✅ **GraphQL API**: API yang fleksibel
- ✅ **Security**: XSS dan CSRF protection
- ✅ **Performance**: SSG, SSR, ISR, CSR optimization

## 🛠️ Commands yang Tersedia

\`\`\`bash
# Development
npm run dev              # Jalankan development server
npm run build           # Build untuk production
npm run start           # Jalankan production server
npm run lint            # Cek kode dengan ESLint

# Docker Commands
npm run docker:build    # Build Docker image
npm run docker:run      # Jalankan container
npm run docker:compose:up    # Jalankan dengan Docker Compose
npm run docker:compose:down  # Stop Docker Compose

# Deployment
npm run deploy          # Deploy ke production
npm run health          # Cek kesehatan aplikasi
\`\`\`

## 🔍 Troubleshooting

### Error: "Module not found"
\`\`\`bash
# Hapus node_modules dan install ulang
rm -rf node_modules package-lock.json
npm install
\`\`\`

### Error: "Port 3000 already in use"
\`\`\`bash
# Cari process yang menggunakan port 3000
lsof -ti:3000

# Kill process tersebut
kill -9 <PID>

# Atau gunakan port lain
PORT=3001 npm run dev
\`\`\`

### Error: Firebase configuration
- Pastikan semua environment variables Firebase sudah benar
- Cek Firebase console untuk konfigurasi yang tepat
- Pastikan Firebase project sudah aktif

### Error: Docker permission (Linux)
\`\`\`bash
# Tambahkan user ke docker group
sudo usermod -aG docker $USER
# Logout dan login kembali
\`\`\`

## 📂 Struktur Project

\`\`\`
si-umkm/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── admin/             # Admin dashboard
│   ├── products/          # Product pages
│   ├── programs/          # Program pages
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── auth/              # Auth components
│   ├── ui/                # UI components (shadcn)
│   └── ...
├── lib/                   # Utilities and configurations
│   ├── auth/              # Authentication logic
│   ├── security/          # Security utilities
│   └── ...
├── public/                # Static assets
├── scripts/               # Deployment scripts
├── Dockerfile             # Docker configuration
├── docker-compose.yml     # Docker Compose
└── package.json           # Dependencies
\`\`\`

## 🎯 Testing

### Manual Testing
1. Buka http://localhost:3000
2. Test registrasi user baru
3. Test login dengan kredensial yang dibuat
4. Test fitur-fitur utama (produk, program, dll)

### API Testing
\`\`\`bash
# Test health endpoint
curl http://localhost:3000/api/health

# Test GraphQL endpoint
curl -X POST http://localhost:3000/api/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ products { id name } }"}'
\`\`\`

## 🚀 Deployment ke Production

### 1. Build Production
\`\`\`bash
npm run build
npm run start
\`\`\`

### 2. Deploy dengan Docker
\`\`\`bash
npm run deploy
\`\`\`

### 3. Deploy ke Cloud Platform
- **Vercel**: Connect GitHub repository
- **Netlify**: Connect GitHub repository  
- **Railway**: Connect GitHub repository
- **DigitalOcean**: Use Docker deployment

## 📞 Support

Jika mengalami masalah:

1. Cek bagian Troubleshooting di atas
2. Pastikan semua prerequisites sudah terinstall
3. Cek log error di terminal
4. Pastikan environment variables sudah benar

## 📄 License

MIT License - Lihat file LICENSE untuk detail lengkap.
\`\`\`

Sekarang buat file environment template:
