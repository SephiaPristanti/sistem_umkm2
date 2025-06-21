#!/bin/bash

echo "🔧 Fixing dependency conflicts..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Step 1: Cleaning existing installations...${NC}"
rm -rf node_modules
rm -f package-lock.json
rm -f yarn.lock

echo -e "${YELLOW}Step 2: Clearing npm cache...${NC}"
npm cache clean --force

echo -e "${YELLOW}Step 3: Installing with legacy peer deps...${NC}"
npm install --legacy-peer-deps

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencies installed successfully!${NC}"
    echo -e "${GREEN}You can now run: npm run dev${NC}"
else
    echo -e "${RED}❌ Installation failed. Trying alternative method...${NC}"
    
    echo -e "${YELLOW}Step 4: Trying with --force flag...${NC}"
    npm install --force
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Dependencies installed with --force!${NC}"
        echo -e "${YELLOW}⚠️  Warning: Some peer dependencies may not be optimal${NC}"
    else
        echo -e "${RED}❌ Installation still failed. Please check the error log.${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}🎉 Setup complete! Run 'npm run dev' to start the application.${NC}"
