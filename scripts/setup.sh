#!/bin/bash

# Setup script untuk Si-UMKM
set -e

echo "🚀 Si-UMKM Setup Script"
echo "======================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_step "Checking prerequisites..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org"
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        log_error "Node.js version must be 18 or higher. Current version: $(node --version)"
        exit 1
    fi
    
    log_info "Node.js version: $(node --version) ✓"
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed"
        exit 1
    fi
    
    log_info "npm version: $(npm --version) ✓"
    
    # Check Git
    if ! command -v git &> /dev/null; then
        log_warn "Git is not installed. Some features may not work properly."
    else
        log_info "Git version: $(git --version) ✓"
    fi
}

# Install dependencies
install_dependencies() {
    log_step "Installing dependencies..."
    
    if [ -f "package-lock.json" ]; then
        npm ci
    else
        npm install
    fi
    
    log_info "Dependencies installed successfully ✓"
}

# Setup environment
setup_environment() {
    log_step "Setting up environment variables..."
    
    if [ ! -f ".env.local" ]; then
        if [ -f ".env.example" ]; then
            cp .env.example .env.local
            log_info "Created .env.local from .env.example"
            log_warn "Please edit .env.local with your actual configuration values"
        else
            log_warn ".env.example not found. Creating basic .env.local"
            cat > .env.local << EOF
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=demo_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=demo.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=demo-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=demo.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:demo

# JWT Configuration
JWT_SECRET=demo_jwt_secret_key_for_development_only
JWT_EXPIRES_IN=7d

# Application Configuration
NODE_ENV=development
PORT=3000
EOF
        fi
    else
        log_info ".env.local already exists ✓"
    fi
}

# Build application
build_application() {
    log_step "Building application..."
    
    npm run build
    
    log_info "Application built successfully ✓"
}

# Main setup function
main() {
    echo ""
    log_info "Starting Si-UMKM setup process..."
    echo ""
    
    check_prerequisites
    echo ""
    
    install_dependencies
    echo ""
    
    setup_environment
    echo ""
    
    # Ask if user wants to build
    read -p "Do you want to build the application now? (y/N): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        build_application
        echo ""
    fi
    
    log_info "✅ Setup completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Edit .env.local with your Firebase configuration"
    echo "2. Run 'npm run dev' to start development server"
    echo "3. Open http://localhost:3000 in your browser"
    echo ""
    echo "For more information, see README.md"
}

# Run main function
main
