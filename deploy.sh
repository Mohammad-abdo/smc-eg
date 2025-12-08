#!/bin/bash
# Deployment script for SMC Dashboard Backend
# Usage: ./deploy.sh [environment]

set -e  # Exit on error

ENVIRONMENT=${1:-production}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "🚀 Starting deployment for environment: $ENVIRONMENT"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from template...${NC}"
    if [ -f .env.example ]; then
        cp .env.example .env
        echo -e "${YELLOW}⚠️  Please edit .env file with your configuration before continuing.${NC}"
        exit 1
    elif [ -f env.template ]; then
        cp env.template .env
        echo -e "${YELLOW}⚠️  Please edit .env file with your configuration before continuing.${NC}"
        exit 1
    else
        echo -e "${RED}❌ No environment template found (.env.example or env.template). Cannot proceed.${NC}"
        exit 1
    fi
fi

# Load environment variables
export $(cat .env | grep -v '^#' | xargs)

echo "📦 Installing dependencies..."
npm ci --production

echo "🔧 Generating Prisma Client..."
npx prisma generate

echo "📊 Checking database connection..."
if npm run test-db > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Database connection successful${NC}"
else
    echo -e "${RED}❌ Database connection failed. Please check your .env file.${NC}"
    exit 1
fi

echo "🔄 Running database migrations..."
npx prisma migrate deploy

if [ "$ENVIRONMENT" = "production" ]; then
    echo "🌱 Seeding database (production)..."
    read -p "Do you want to seed the database? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        npm run seed
    fi
else
    echo "🌱 Seeding database (development)..."
    npm run seed
fi

echo ""
echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo ""
echo "To start the server:"
echo "  - Development: npm run dev"
echo "  - Production: npm start"
echo "  - With PM2: pm2 start server.js --name smc-backend"
echo ""

