#!/bin/bash

echo "🚀 Si-UMKM Local Setup Script"
echo "=============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
print_status "Checking prerequisites..."

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js found: $NODE_VERSION"
    
    # Check if version is >= 18
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
    if [ "$NODE_MAJOR" -lt 18 ]; then
        print_error "Node.js version 18 or higher required. Current: $NODE_VERSION"
        print_status "Please update Node.js: https://nodejs.org/"
        exit 1
    fi
else
    print_error "Node.js not found. Please install Node.js 18+: https://nodejs.org/"
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_success "npm found: $NPM_VERSION"
else
    print_error "npm not found. Please install npm."
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root directory."
    exit 1
fi

print_success "Prerequisites check passed!"

# Install dependencies
print_status "Installing dependencies..."
if npm install --legacy-peer-deps; then
    print_success "Dependencies installed successfully!"
else
    print_error "Failed to install dependencies. Trying alternative method..."
    
    # Try clearing cache and reinstalling
    print_status "Clearing npm cache..."
    npm cache clean --force
    
    print_status "Removing node_modules..."
    rm -rf node_modules package-lock.json
    
    print_status "Reinstalling dependencies..."
    if npm install --legacy-peer-deps; then
        print_success "Dependencies installed successfully on second attempt!"
    else
        print_error "Failed to install dependencies. Please check your internet connection and try manually."
        exit 1
    fi
fi

# Setup environment file
print_status "Setting up environment file..."
if [ ! -f ".env.local" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env.local
        print_success "Created .env.local from .env.example"
    else
        # Create basic .env.local
        cat > .env.local << EOF
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random-$(date +%s)
JWT_EXPIRES_IN=7d

# Demo Mode
NEXT_PUBLIC_DEMO_MODE=true

# Firebase (Optional)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
EOF
        print_success "Created basic .env.local file"
    fi
else
    print_warning ".env.local already exists, skipping..."
fi

# Check if port 3000 is available
print_status "Checking if port 3000 is available..."
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    print_warning "Port 3000 is already in use. You may need to use a different port."
    print_status "You can start the server with: npm run dev -- --port 3001"
else
    print_success "Port 3000 is available!"
fi

# Build the project
print_status "Building the project..."
if npm run build; then
    print_success "Project built successfully!"
else
    print_warning "Build failed, but you can still run in development mode."
fi

# Final instructions
echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Start the development server:"
echo "   npm run dev"
echo ""
echo "2. Open your browser and go to:"
echo "   http://localhost:3000"
echo ""
echo "3. Login as admin:"
echo "   Email: admin@si-umkm.com"
echo "   Password: admin123"
echo ""
echo "4. Test CRUD operations:"
echo "   - Go to: http://localhost:3000/admin/products"
echo "   - Or debug page: http://localhost:3000/debug/crud"
echo ""
echo "🔧 Troubleshooting:"
echo "   - If port 3000 is busy: npm run dev -- --port 3001"
echo "   - If dependencies fail: rm -rf node_modules && npm install"
echo "   - Check logs in browser console (F12)"
echo ""
echo "📚 Documentation: docs/LOCAL_SETUP.md"
echo ""

# Ask if user wants to start the server
read -p "Do you want to start the development server now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Starting development server..."
    npm run dev
fi
