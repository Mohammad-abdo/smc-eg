# 🚀 SMC Dashboard Backend - Complete Deployment Guide

## 📦 Quick Start

### Option 1: Docker (Recommended)
```bash
cp .env.example .env
# Edit .env with your database credentials
docker-compose up -d
```

### Option 2: Traditional Server
```bash
cp .env.example .env
# Edit .env
bash deploy.sh        # Linux/Mac
.\deploy.ps1          # Windows
pm2 start ecosystem.config.js
```

### Option 3: Cloud Platforms
- **Vercel**: See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md#vercel-deployment)
- **Railway**: Use `railway.json` configuration
- **Render**: Use `render.yaml` configuration

---

## 📋 All Available Files

### Configuration Files
- ✅ `Dockerfile` - Docker container configuration
- ✅ `docker-compose.yml` - Complete stack (backend + MySQL)
- ✅ `.dockerignore` - Docker build exclusions
- ✅ `ecosystem.config.js` - PM2 process manager config
- ✅ `nginx.conf` - Nginx reverse proxy configuration
- ✅ `smc-backend.service` - Systemd service file
- ✅ `railway.json` - Railway platform configuration
- ✅ `render.yaml` - Render.com configuration
- ✅ `.github/workflows/deploy.yml` - GitHub Actions CI/CD

### Deployment Scripts
- ✅ `deploy.sh` - Linux/Mac deployment script
- ✅ `deploy.ps1` - Windows PowerShell deployment script
- ✅ `Makefile` - Make commands for common tasks

### Documentation
- ✅ `DEPLOYMENT_GUIDE.md` - Comprehensive deployment guide
- ✅ `QUICK_DEPLOY.md` - Quick reference
- ✅ `DEPLOYMENT_SUMMARY.md` - Overview
- ✅ `TROUBLESHOOTING_DB_CONNECTION.md` - Database issues

### Database
- ✅ `init.sql` - MySQL initialization script

---

## 🎯 Deployment Options

### 1. Docker Deployment
```bash
# Build and run
docker-compose up -d

# Or manually
docker build -t smc-backend .
docker run -p 3000:3000 --env-file .env smc-backend
```

### 2. Traditional Linux Server
```bash
# Install dependencies
npm install --production

# Setup
cp .env.example .env
nano .env

# Deploy
bash deploy.sh

# Start with PM2
pm2 start ecosystem.config.js

# Or with systemd
sudo cp smc-backend.service /etc/systemd/system/
sudo systemctl enable smc-backend
sudo systemctl start smc-backend
```

### 3. Nginx Reverse Proxy
```bash
# Copy nginx config
sudo cp nginx.conf /etc/nginx/sites-available/smc-backend
sudo ln -s /etc/nginx/sites-available/smc-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 4. Vercel
1. Connect GitHub repo
2. Set Root Directory: `backend`
3. Add environment variables
4. Deploy

### 5. Railway
1. Connect GitHub repo
2. Railway auto-detects `railway.json`
3. Add MySQL service
4. Set environment variables
5. Deploy

### 6. Render
1. Connect GitHub repo
2. Render auto-detects `render.yaml`
3. Set environment variables
4. Deploy

---

## 🔧 Available Commands

### NPM Scripts
```bash
npm start              # Start production server
npm run dev            # Start development server
npm run test-db        # Test database connection
npm run prisma:generate # Generate Prisma Client
npm run prisma:migrate:deploy # Run migrations
npm run seed           # Seed database
npm run docker:build  # Build Docker image
npm run docker:compose # Start Docker Compose
```

### Make Commands (Linux/Mac)
```bash
make install           # Install dependencies
make dev              # Start development
make deploy           # Deploy to production
make docker-build     # Build Docker image
make docker-up        # Start Docker Compose
make migrate          # Run migrations
make seed            # Seed database
```

### PM2 Commands
```bash
pm2 start ecosystem.config.js  # Start with PM2
pm2 logs smc-backend           # View logs
pm2 restart smc-backend        # Restart
pm2 stop smc-backend           # Stop
pm2 delete smc-backend         # Remove
```

---

## 📝 Environment Variables

Create `.env` file (copy from `.env.example`):

```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=smc_dashboard
DB_PORT=3306

# Server
PORT=3000
NODE_ENV=production

# Optional
CORS_ORIGIN=*
INIT_SECRET=your_secret_token
```

---

## ✅ Post-Deployment Checklist

- [ ] Environment variables configured (`.env`)
- [ ] Database connection working (`npm run test-db`)
- [ ] Migrations applied (`npx prisma migrate deploy`)
- [ ] Prisma Client generated (`npx prisma generate`)
- [ ] Database seeded (optional: `npm run seed`)
- [ ] Health check passing (`curl http://localhost:3000/api/health`)
- [ ] Server running (check logs)
- [ ] Reverse proxy configured (if using Nginx)
- [ ] SSL/TLS certificates installed (for production)
- [ ] Monitoring setup (PM2, systemd, etc.)

---

## 🆘 Troubleshooting

### Database Connection Issues
See: [TROUBLESHOOTING_DB_CONNECTION.md](./TROUBLESHOOTING_DB_CONNECTION.md)

### Migration Issues
See: [FIX_MIGRATION.md](./FIX_MIGRATION.md)

### General Issues
See: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md#common-issues--solutions)

---

## 📚 Documentation

- **Complete Guide**: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **Quick Reference**: [QUICK_DEPLOY.md](./QUICK_DEPLOY.md)
- **Summary**: [DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md)

---

**All deployment options are ready! 🎉**

