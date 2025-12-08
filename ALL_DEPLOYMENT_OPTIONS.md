# 🚀 All Deployment Options - Complete Reference

This document lists ALL available deployment options and their configurations.

## 📋 Table of Contents

1. [Docker Deployment](#docker-deployment)
2. [Traditional Server Deployment](#traditional-server-deployment)
3. [Cloud Platform Deployments](#cloud-platform-deployments)
4. [Process Management](#process-management)
5. [Reverse Proxy Configuration](#reverse-proxy-configuration)
6. [CI/CD Integration](#cicd-integration)
7. [Configuration Files](#configuration-files)

---

## 🐳 Docker Deployment

### Files
- `Dockerfile` - Multi-stage production build
- `docker-compose.yml` - Complete stack with MySQL
- `.dockerignore` - Build exclusions
- `init.sql` - Database initialization

### Commands
```bash
# Build image
docker build -t smc-backend .

# Run container
docker run -p 3000:3000 --env-file .env smc-backend

# Docker Compose (recommended)
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop
docker-compose down
```

### NPM Scripts
```bash
npm run docker:build      # Build Docker image
npm run docker:run       # Run Docker container
npm run docker:compose   # Start Docker Compose
```

---

## 🖥️ Traditional Server Deployment

### Linux/Mac

#### Option 1: PM2 (Recommended)
```bash
# Deploy
bash deploy.sh

# Start with PM2
pm2 start ecosystem.config.js --env production

# Or use Makefile
make deploy
make start
```

#### Option 2: Systemd
```bash
# Copy service file
sudo cp smc-backend.service /etc/systemd/system/

# Enable and start
sudo systemctl enable smc-backend
sudo systemctl start smc-backend

# Check status
sudo systemctl status smc-backend
```

### Windows

#### Option 1: PowerShell Script
```powershell
.\deploy.ps1
```

#### Option 2: Manual
```powershell
npm install --production
npx prisma generate
npx prisma migrate deploy
npm start
```

### Files
- `deploy.sh` - Linux/Mac deployment script
- `deploy.ps1` - Windows PowerShell script
- `ecosystem.config.js` - PM2 configuration
- `smc-backend.service` - Systemd service file
- `Makefile` - Make commands

---

## ☁️ Cloud Platform Deployments

### Vercel

#### Configuration
- Root Directory: `backend`
- Build Command: `npm install && npx prisma generate`
- Output Directory: (leave empty)
- Framework: Other

#### Environment Variables
```
DB_HOST=your_host
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=smc_dashboard
DB_PORT=3306
NODE_ENV=production
PORT=3000
```

#### Files
- `vercel.json` - Vercel configuration (in root)

---

### Railway

#### Configuration
Railway auto-detects `railway.json`

#### Files
- `railway.json` - Railway platform configuration

#### Setup
1. Connect GitHub repo
2. Add MySQL service
3. Set environment variables
4. Deploy

---

### Render

#### Configuration
Render auto-detects `render.yaml`

#### Files
- `render.yaml` - Render.com configuration

#### Setup
1. Connect GitHub repo
2. Set environment variables
3. Deploy

---

## 🔄 Process Management

### PM2

#### Configuration File
- `ecosystem.config.js`

#### Commands
```bash
pm2 start ecosystem.config.js
pm2 logs smc-backend
pm2 restart smc-backend
pm2 stop smc-backend
pm2 delete smc-backend
pm2 save
pm2 startup
```

### Systemd

#### Configuration File
- `smc-backend.service`

#### Commands
```bash
sudo systemctl start smc-backend
sudo systemctl stop smc-backend
sudo systemctl restart smc-backend
sudo systemctl status smc-backend
sudo systemctl enable smc-backend
sudo journalctl -u smc-backend -f
```

---

## 🌐 Reverse Proxy Configuration

### Nginx

#### Configuration File
- `nginx.conf` - Complete Nginx configuration

#### Setup
```bash
# Copy config
sudo cp nginx.conf /etc/nginx/sites-available/smc-backend

# Create symlink
sudo ln -s /etc/nginx/sites-available/smc-backend /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload
sudo systemctl reload nginx
```

#### Features
- HTTP/HTTPS support
- API route handling
- Health check endpoint
- Gzip compression
- Caching control

---

## 🔁 CI/CD Integration

### GitHub Actions

#### Configuration File
- `.github/workflows/deploy.yml`

#### Features
- Auto-deploy on push to main/master
- Manual deployment trigger
- Node.js setup
- Prisma Client generation
- Docker build (optional)

#### Usage
1. Push to `main` or `master` branch
2. GitHub Actions runs automatically
3. Or trigger manually from Actions tab

---

## 📁 Configuration Files Reference

### Environment Variables
- `env.template` - Complete environment template
- `.env.example` - Basic example (if exists)
- `.env` - Your actual configuration (not in git)

### Docker
- `Dockerfile` - Container build instructions
- `docker-compose.yml` - Multi-container setup
- `.dockerignore` - Build exclusions
- `init.sql` - Database initialization

### Process Management
- `ecosystem.config.js` - PM2 configuration
- `smc-backend.service` - Systemd service

### Reverse Proxy
- `nginx.conf` - Nginx configuration

### Cloud Platforms
- `railway.json` - Railway configuration
- `render.yaml` - Render configuration
- `vercel.json` - Vercel configuration (in root)

### Deployment Scripts
- `deploy.sh` - Linux/Mac deployment
- `deploy.ps1` - Windows deployment
- `Makefile` - Make commands

### CI/CD
- `.github/workflows/deploy.yml` - GitHub Actions

---

## 🛠️ Make Commands

```bash
make install          # Install dependencies
make dev             # Start development server
make build           # Build for production
make start           # Start production server
make stop            # Stop server
make test            # Run tests
make clean           # Clean build artifacts
make deploy          # Deploy to production
make docker-build    # Build Docker image
make docker-up       # Start Docker Compose
make docker-down     # Stop Docker Compose
make migrate         # Run database migrations
make seed           # Seed database
make prisma-generate # Generate Prisma Client
make health         # Check health endpoint
```

---

## 📝 Quick Reference

### Fastest Deployment
```bash
# Docker (easiest)
docker-compose up -d

# Traditional (Linux/Mac)
bash deploy.sh && pm2 start ecosystem.config.js

# Traditional (Windows)
.\deploy.ps1
```

### Required Steps (All Methods)
1. Copy `env.template` to `.env`
2. Edit `.env` with your database credentials
3. Run deployment script or Docker
4. Verify: `curl http://localhost:3000/api/health`

---

## ✅ Deployment Checklist

- [ ] Environment variables configured (`.env`)
- [ ] Database accessible
- [ ] Prisma Client generated
- [ ] Migrations applied
- [ ] Server running
- [ ] Health check passing
- [ ] Reverse proxy configured (if needed)
- [ ] SSL/TLS installed (for production)
- [ ] Monitoring setup
- [ ] Backup strategy in place

---

**All deployment options are configured and ready! 🎉**

