#!/bin/bash

echo "🔥 Firebase Setup Script untuk Si-UMKM"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Langkah 1: Cek Environment Variables${NC}"

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}⚠️  File .env.local tidak ditemukan. Membuat dari template...${NC}"
    cp .env.example .env.local
    echo -e "${GREEN}✅ File .env.local berhasil dibuat${NC}"
else
    echo -e "${GREEN}✅ File .env.local sudah ada${NC}"
fi

echo -e "\n${BLUE}📋 Langkah 2: Validasi Firebase Configuration${NC}"

# Read environment variables
source .env.local

# Check Firebase config
if [ -z "$NEXT_PUBLIC_FIREBASE_API_KEY" ] || [ "$NEXT_PUBLIC_FIREBASE_API_KEY" = "demo-api-key" ]; then
    echo -e "${RED}❌ Firebase API Key belum dikonfigurasi${NC}"
    echo -e "${YELLOW}📖 Silakan ikuti panduan di docs/FIREBASE_SETUP.md${NC}"
    echo -e "${YELLOW}🔗 Atau buka: https://console.firebase.google.com${NC}"
    exit 1
else
    echo -e "${GREEN}✅ Firebase API Key dikonfigurasi${NC}"
fi

if [ -z "$NEXT_PUBLIC_FIREBASE_PROJECT_ID" ] || [ "$NEXT_PUBLIC_FIREBASE_PROJECT_ID" = "demo-project" ]; then
    echo -e "${RED}❌ Firebase Project ID belum dikonfigurasi${NC}"
    exit 1
else
    echo -e "${GREEN}✅ Firebase Project ID dikonfigurasi${NC}"
fi

echo -e "\n${BLUE}📋 Langkah 3: Install Firebase CLI (Opsional)${NC}"
if command -v firebase &> /dev/null; then
    echo -e "${GREEN}✅ Firebase CLI sudah terinstall${NC}"
    firebase --version
else
    echo -e "${YELLOW}⚠️  Firebase CLI belum terinstall${NC}"
    echo -e "${BLUE}💡 Install dengan: npm install -g firebase-tools${NC}"
fi

echo -e "\n${BLUE}📋 Langkah 4: Test Firebase Connection${NC}"

# Test build
echo -e "${YELLOW}🔨 Testing build...${NC}"
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Build berhasil${NC}"
else
    echo -e "${RED}❌ Build gagal. Cek konfigurasi Firebase${NC}"
    exit 1
fi

echo -e "\n${BLUE}📋 Langkah 5: Start Development Server${NC}"
echo -e "${GREEN}🚀 Menjalankan development server...${NC}"
echo -e "${BLUE}📖 Buka browser di: http://localhost:3000${NC}"
echo -e "${BLUE}🔐 Test login di: http://localhost:3000/auth/login${NC}"

# Start dev server
npm run dev
