#!/bin/bash

echo "🧪 Manual CRUD Testing Script"
echo "============================="

# Configuration
BASE_URL="http://localhost:3000"
ADMIN_EMAIL="admin@si-umkm.com"
ADMIN_PASSWORD="admin123"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }
print_info() { echo -e "${YELLOW}ℹ️  $1${NC}"; }

# Function to test server
test_server() {
    print_info "Testing if server is running..."
    
    if curl -f "$BASE_URL/api/health" >/dev/null 2>&1; then
        print_success "Server is running"
        return 0
    else
        print_error "Server is not running"
        print_info "Please start the server with: npm run dev"
        return 1
    fi
}

# Function to get auth token
get_auth_token() {
    print_info "Getting authentication token..."
    
    local response=$(curl -s -X POST "$BASE_URL/api/users/login" \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}")
    
    local token=$(echo "$response" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    
    if [ -n "$token" ]; then
        print_success "Authentication successful"
        echo "$token"
        return 0
    else
        print_error "Authentication failed"
        echo "Response: $response"
        return 1
    fi
}

# Function to test CREATE
test_create() {
    local token=$1
    print_info "Testing CREATE operation..."
    
    local test_product='{
        "name": "Test Product '$(date +%s)'",
        "description": "This is a test product created by automated script",
        "price": 25000,
        "originalPrice": 30000,
        "category": "Makanan",
        "stock": 100,
        "businessName": "Test Business",
        "location": "Test Location"
    }'
    
    local response=$(curl -s -X POST "$BASE_URL/api/admin/products" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $token" \
        -d "$test_product")
    
    local product_id=$(echo "$response" | grep -o '"id":[0-9]*' | cut -d':' -f2)
    
    if [ -n "$product_id" ]; then
        print_success "CREATE successful - Product ID: $product_id"
        echo "$product_id"
        return 0
    else
        print_error "CREATE failed"
        echo "Response: $response"
        return 1
    fi
}

# Function to test READ
test_read() {
    local token=$1
    print_info "Testing READ operation..."
    
    local response=$(curl -s -H "Authorization: Bearer $token" \
        "$BASE_URL/api/admin/products")
    
    local product_count=$(echo "$response" | grep -o '"products":\[' | wc -l)
    
    if [ "$product_count" -gt 0 ]; then
        local total_items=$(echo "$response" | grep -o '"totalItems":[0-9]*' | cut -d':' -f2)
        print_success "READ successful - Found $total_items products"
        return 0
    else
        print_error "READ failed"
        echo "Response: $response"
        return 1
    fi
}

# Function to test UPDATE
test_update() {
    local token=$1
    local product_id=$2
    print_info "Testing UPDATE operation..."
    
    local update_data='{
        "name": "Updated Test Product '$(date +%s)'",
        "description": "This product has been updated by automated script",
        "price": 35000
    }'
    
    local response=$(curl -s -X PUT "$BASE_URL/api/admin/products/$product_id" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $token" \
        -d "$update_data")
    
    if echo "$response" | grep -q "Updated Test Product"; then
        print_success "UPDATE successful"
        return 0
    else
        print_error "UPDATE failed"
        echo "Response: $response"
        return 1
    fi
}

# Function to test DELETE
test_delete() {
    local token=$1
    local product_id=$2
    print_info "Testing DELETE operation..."
    
    local response=$(curl -s -X DELETE "$BASE_URL/api/admin/products/$product_id" \
        -H "Authorization: Bearer $token")
    
    if echo "$response" | grep -q "deleted successfully"; then
        print_success "DELETE successful"
        return 0
    else
        print_error "DELETE failed"
        echo "Response: $response"
        return 1
    fi
}

# Function to run all tests
run_all_tests() {
    echo "🚀 Running all CRUD tests..."
    echo ""
    
    # Test server
    if ! test_server; then
        exit 1
    fi
    
    # Get auth token
    local token=$(get_auth_token)
    if [ -z "$token" ]; then
        exit 1
    fi
    
    echo ""
    
    # Test READ first
    test_read "$token"
    echo ""
    
    # Test CREATE
    local product_id=$(test_create "$token")
    if [ -z "$product_id" ]; then
        print_error "Cannot continue without successful CREATE"
        exit 1
    fi
    echo ""
    
    # Test UPDATE
    test_update "$token" "$product_id"
    echo ""
    
    # Test DELETE
    test_delete "$token" "$product_id"
    echo ""
    
    print_success "All CRUD tests completed!"
}

# Function to show interactive menu
show_menu() {
    echo ""
    echo "Manual CRUD Testing Options:"
    echo "1. Test server connection"
    echo "2. Test authentication"
    echo "3. Test READ (Get products)"
    echo "4. Test CREATE (Add product)"
    echo "5. Test UPDATE (Edit product)"
    echo "6. Test DELETE (Remove product)"
    echo "7. Run all tests"
    echo "8. Open browser to admin panel"
    echo "9. Open browser to debug page"
    echo "0. Exit"
    echo ""
}

# Interactive mode
interactive_mode() {
    local token=""
    local last_product_id=""
    
    while true; do
        show_menu
        read -p "Enter your choice (0-9): " choice
        
        case $choice in
            1)
                test_server
                ;;
            2)
                token=$(get_auth_token)
                ;;
            3)
                if [ -z "$token" ]; then
                    token=$(get_auth_token)
                fi
                test_read "$token"
                ;;
            4)
                if [ -z "$token" ]; then
                    token=$(get_auth_token)
                fi
                last_product_id=$(test_create "$token")
                ;;
            5)
                if [ -z "$token" ]; then
                    token=$(get_auth_token)
                fi
                if [ -z "$last_product_id" ]; then
                    read -p "Enter product ID to update: " last_product_id
                fi
                test_update "$token" "$last_product_id"
                ;;
            6)
                if [ -z "$token" ]; then
                    token=$(get_auth_token)
                fi
                if [ -z "$last_product_id" ]; then
                    read -p "Enter product ID to delete: " last_product_id
                fi
                test_delete "$token" "$last_product_id"
                ;;
            7)
                run_all_tests
                ;;
            8)
                print_info "Opening admin panel..."
                if command -v xdg-open > /dev/null; then
                    xdg-open "$BASE_URL/admin/products"
                elif command -v open > /dev/null; then
                    open "$BASE_URL/admin/products"
                else
                    print_info "Please open: $BASE_URL/admin/products"
                fi
                ;;
            9)
                print_info "Opening debug page..."
                if command -v xdg-open > /dev/null; then
                    xdg-open "$BASE_URL/debug/crud"
                elif command -v open > /dev/null; then
                    open "$BASE_URL/debug/crud"
                else
                    print_info "Please open: $BASE_URL/debug/crud"
                fi
                ;;
            0)
                print_info "Exiting..."
                exit 0
                ;;
            *)
                print_error "Invalid choice. Please select 0-9."
                ;;
        esac
        
        echo ""
        read -p "Press Enter to continue..."
    done
}

# Main execution
if [ "$1" = "--auto" ]; then
    run_all_tests
else
    interactive_mode
fi
