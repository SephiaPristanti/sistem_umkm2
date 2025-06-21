#!/bin/bash

echo "🔧 Si-UMKM Troubleshooting Script"
echo "================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Function to check system
check_system() {
    print_status "System Information:"
    echo "OS: $(uname -s)"
    echo "Architecture: $(uname -m)"
    echo "Node.js: $(node --version 2>/dev/null || echo 'Not installed')"
    echo "npm: $(npm --version 2>/dev/null || echo 'Not installed')"
    echo "Current directory: $(pwd)"
    echo ""
}

# Function to check project structure
check_project() {
    print_status "Checking project structure..."
    
    local required_files=("package.json" "next.config.mjs" "app" "components" "lib")
    local missing_files=()
    
    for file in "${required_files[@]}"; do
        if [ ! -e "$file" ]; then
            missing_files+=("$file")
        fi
    done
    
    if [ ${#missing_files[@]} -eq 0 ]; then
        print_success "All required files/directories found"
    else
        print_error "Missing files/directories: ${missing_files[*]}"
        return 1
    fi
}

# Function to check dependencies
check_dependencies() {
    print_status "Checking dependencies..."
    
    if [ ! -d "node_modules" ]; then
        print_error "node_modules directory not found"
        print_status "Run: npm install"
        return 1
    fi
    
    # Check critical packages
    local critical_packages=("next" "react" "react-dom" "@types/node")
    for package in "${critical_packages[@]}"; do
        if [ ! -d "node_modules/$package" ]; then
            print_error "Critical package missing: $package"
            return 1
        fi
    done
    
    print_success "Dependencies check passed"
}

# Function to check environment
check_environment() {
    print_status "Checking environment configuration..."
    
    if [ ! -f ".env.local" ]; then
        print_warning ".env.local not found"
        print_status "Creating basic .env.local..."
        
        cat > .env.local << EOF
JWT_SECRET=troubleshoot-jwt-secret-$(date +%s)
JWT_EXPIRES_IN=7d
NEXT_PUBLIC_DEMO_MODE=true
EOF
        print_success "Created .env.local"
    else
        print_success ".env.local found"
        
        # Check critical env vars
        if ! grep -q "JWT_SECRET" .env.local; then
            print_warning "JWT_SECRET not found in .env.local"
            echo "JWT_SECRET=troubleshoot-jwt-secret-$(date +%s)" >> .env.local
            print_success "Added JWT_SECRET"
        fi
    fi
}

# Function to check ports
check_ports() {
    print_status "Checking port availability..."
    
    local ports=(3000 3001 3002)
    local available_port=""
    
    for port in "${ports[@]}"; do
        if ! lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
            available_port=$port
            break
        fi
    done
    
    if [ -n "$available_port" ]; then
        print_success "Port $available_port is available"
        echo "export SUGGESTED_PORT=$available_port" > .port_suggestion
    else
        print_warning "Ports 3000-3002 are all in use"
        print_status "You may need to kill existing processes or use a different port"
    fi
}

# Function to test API endpoints
test_api() {
    print_status "Testing API endpoints..."
    
    # Start server in background for testing
    print_status "Starting test server..."
    npm run dev &
    SERVER_PID=$!
    
    # Wait for server to start
    sleep 10
    
    # Test health endpoint
    if curl -f http://localhost:3000/api/health >/dev/null 2>&1; then
        print_success "Health endpoint working"
    else
        print_error "Health endpoint not responding"
    fi
    
    # Test login endpoint
    local login_response=$(curl -s -X POST http://localhost:3000/api/users/login \
        -H "Content-Type: application/json" \
        -d '{"email":"admin@si-umkm.com","password":"admin123"}' 2>/dev/null)
    
    if echo "$login_response" | grep -q "token"; then
        print_success "Login endpoint working"
    else
        print_error "Login endpoint not working"
        echo "Response: $login_response"
    fi
    
    # Kill test server
    kill $SERVER_PID 2>/dev/null
    wait $SERVER_PID 2>/dev/null
}

# Function to fix common issues
fix_issues() {
    print_status "Attempting to fix common issues..."
    
    # Clear npm cache
    print_status "Clearing npm cache..."
    npm cache clean --force
    
    # Remove and reinstall node_modules
    print_status "Reinstalling dependencies..."
    rm -rf node_modules package-lock.json
    npm install --legacy-peer-deps
    
    # Clear Next.js cache
    print_status "Clearing Next.js cache..."
    rm -rf .next
    
    print_success "Common fixes applied"
}

# Function to generate report
generate_report() {
    local report_file="troubleshoot-report-$(date +%Y%m%d-%H%M%S).txt"
    
    print_status "Generating troubleshoot report..."
    
    {
        echo "Si-UMKM Troubleshoot Report"
        echo "Generated: $(date)"
        echo "=========================="
        echo ""
        
        echo "System Information:"
        uname -a
        echo "Node.js: $(node --version 2>/dev/null || echo 'Not installed')"
        echo "npm: $(npm --version 2>/dev/null || echo 'Not installed')"
        echo ""
        
        echo "Project Structure:"
        ls -la
        echo ""
        
        echo "Package.json:"
        if [ -f "package.json" ]; then
            head -20 package.json
        else
            echo "package.json not found"
        fi
        echo ""
        
        echo "Environment:"
        if [ -f ".env.local" ]; then
            echo ".env.local exists"
            grep -v "SECRET\|KEY\|PASSWORD" .env.local 2>/dev/null || echo "No safe env vars to show"
        else
            echo ".env.local not found"
        fi
        echo ""
        
        echo "Recent npm logs:"
        if [ -f "npm-debug.log" ]; then
            tail -50 npm-debug.log
        else
            echo "No npm debug logs found"
        fi
        
    } > "$report_file"
    
    print_success "Report generated: $report_file"
}

# Main menu
show_menu() {
    echo ""
    echo "Select troubleshooting option:"
    echo "1. Full system check"
    echo "2. Check project structure"
    echo "3. Check dependencies"
    echo "4. Check environment"
    echo "5. Check ports"
    echo "6. Test API endpoints"
    echo "7. Fix common issues"
    echo "8. Generate report"
    echo "9. Exit"
    echo ""
}

# Main execution
main() {
    check_system
    
    while true; do
        show_menu
        read -p "Enter your choice (1-9): " choice
        
        case $choice in
            1)
                check_project && check_dependencies && check_environment && check_ports
                ;;
            2)
                check_project
                ;;
            3)
                check_dependencies
                ;;
            4)
                check_environment
                ;;
            5)
                check_ports
                ;;
            6)
                test_api
                ;;
            7)
                fix_issues
                ;;
            8)
                generate_report
                ;;
            9)
                print_status "Exiting troubleshoot script"
                exit 0
                ;;
            *)
                print_error "Invalid choice. Please select 1-9."
                ;;
        esac
        
        echo ""
        read -p "Press Enter to continue..."
    done
}

# Run main function
main
