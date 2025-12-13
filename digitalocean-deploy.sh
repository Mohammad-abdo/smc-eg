#!/bin/bash
# DigitalOcean App Platform Deployment Script
# This script prepares the project for deployment on DigitalOcean

set -e  # Exit on error

echo "🚀 Preparing for DigitalOcean deployment..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found${NC}"
    if [ -f env.template ]; then
        cp env.template .env
        echo -e "${YELLOW}Created .env from template. Please configure it.${NC}"
    fi
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --production

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Run database migrations
echo "📊 Running database migrations..."
npx prisma migrate deploy || echo -e "${YELLOW}Migrations may have already been applied${NC}"

echo ""
echo -e "${GREEN}✅ Project is ready for DigitalOcean deployment!${NC}"
echo ""
echo "Next steps:"
echo "1. Push code to your repository"
echo "2. Connect repository to DigitalOcean App Platform"
echo "3. Configure environment variables in DigitalOcean dashboard"
echo "4. Set build command: npm run prisma:generate"
echo "5. Set run command: npm start"
echo ""



