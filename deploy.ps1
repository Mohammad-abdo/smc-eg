# PowerShell Deployment Script for SMC Dashboard Backend
# Usage: .\deploy.ps1 [environment]

param(
    [string]$Environment = "production"
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting deployment for environment: $Environment" -ForegroundColor Cyan
Write-Host ""

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  .env file not found. Creating from template..." -ForegroundColor Yellow
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "⚠️  Please edit .env file with your configuration before continuing." -ForegroundColor Yellow
        exit 1
    } elseif (Test-Path "env.template") {
        Copy-Item "env.template" ".env"
        Write-Host "⚠️  Please edit .env file with your configuration before continuing." -ForegroundColor Yellow
        exit 1
    } else {
        Write-Host "❌ No environment template found (.env.example or env.template). Cannot proceed." -ForegroundColor Red
        exit 1
    }
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
npm ci --production
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Generate Prisma Client
Write-Host "🔧 Generating Prisma Client..." -ForegroundColor Cyan
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to generate Prisma Client" -ForegroundColor Red
    exit 1
}

# Test database connection
Write-Host "📊 Checking database connection..." -ForegroundColor Cyan
npm run test-db 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Database connection successful" -ForegroundColor Green
} else {
    Write-Host "❌ Database connection failed. Please check your .env file." -ForegroundColor Red
    exit 1
}

# Run migrations
Write-Host "🔄 Running database migrations..." -ForegroundColor Cyan
npx prisma migrate deploy
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to run migrations" -ForegroundColor Red
    exit 1
}

# Seed database
if ($Environment -eq "production") {
    $seed = Read-Host "Do you want to seed the database? (y/N)"
    if ($seed -eq "y" -or $seed -eq "Y") {
        Write-Host "🌱 Seeding database..." -ForegroundColor Cyan
        npm run seed
    }
} else {
    Write-Host "🌱 Seeding database (development)..." -ForegroundColor Cyan
    npm run seed
}

Write-Host ""
Write-Host "✅ Deployment completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "To start the server:" -ForegroundColor Cyan
Write-Host "  - Development: npm run dev"
Write-Host "  - Production: npm start"
Write-Host "  - With PM2: pm2 start server.js --name smc-backend"
Write-Host ""

