# 🚀 Comprehensive Deployment Guide - Multi-Server Support

This guide covers deploying the SMC Dashboard Backend to various platforms and servers.

## 📋 Table of Contents

1. [Docker Deployment](#docker-deployment)
2. [Vercel Deployment](#vercel-deployment)
3. [Traditional Server Deployment](#traditional-server-deployment)
4. [Railway Deployment](#railway-deployment)
5. [Render Deployment](#render-deployment)
6. [AWS/EC2 Deployment](#awsec2-deployment)
7. [Common Issues & Solutions](#common-issues--solutions)

---

## 🐳 Docker Deployment

### Prerequisites
- Docker installed
- Docker Compose (optional)

### Quick Start

1. **Clone and navigate:**
   ```bash
   cd backend
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Build and run:**
   ```bash
   # Using Docker Compose (includes database)
   docker-compose up -d

   # Or using Docker directly
   docker build -t smc-backend .
   docker run -p 3000:3000 --env-file .env smc-backend
   ```

4. **Run migrations:**
   ```bash
   docker exec -it smc-backend npx prisma migrate deploy
   ```

5. **Seed database (optional):**
   ```bash
   docker exec -it smc-backend npm run seed
   ```

### Production Docker Deployment

```bash
# Build for production
docker build -t smc-backend:latest .

# Run with environment variables
docker run -d \
  --name smc-backend \
  -p 3000:3000 \
  --env-file .env \
  --restart unless-stopped \
  smc-backend:latest
```

---

## ▲ Vercel Deployment

### Method 1: Vercel Dashboard

1. **Connect GitHub repository** to Vercel
2. **Set Root Directory:** `backend`
3. **Build Settings:**
   - Framework: Other
   - Build Command: `npm install && npx prisma generate`
   - Output Directory: (leave empty)
   - Install Command: `npm install`

4. **Environment Variables:**
   ```
   DB_HOST=your_host
   DB_USER=your_user
   DB_PASSWORD=your_password
   DB_NAME=smc_dashboard
   DB_PORT=3306
   NODE_ENV=production
   PORT=3000
   ```

5. **Deploy**

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd backend
vercel --prod
```

### Post-Deployment (Vercel)

After deployment, run migrations:
```bash
# Via API endpoint (if configured)
curl -X POST https://your-app.vercel.app/api/init

# Or via Vercel CLI
vercel env pull
npx prisma migrate deploy
```

---

## 🖥️ Traditional Server Deployment

### Prerequisites
- Node.js 20.19+ installed (required for Prisma 7.0.1+)
- MySQL/MariaDB database
- PM2 (recommended for process management)

### Step-by-Step

1. **Clone repository:**
   ```bash
   git clone <your-repo-url>
   cd smc-digital-suite/backend
   ```

2. **Install dependencies:**
   ```bash
   npm install --production
   ```

3. **Set up environment:**
   ```bash
   cp .env.example .env
   nano .env  # Edit with your credentials
   ```

4. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

5. **Run migrations:**
   ```bash
   npx prisma migrate deploy
   ```

6. **Seed database (optional):**
   ```bash
   npm run seed
   ```

7. **Start with PM2:**
   ```bash
   # Install PM2 globally
   npm install -g pm2

   # Start application
   pm2 start server.js --name smc-backend

   # Save PM2 configuration
   pm2 save

   # Setup PM2 to start on boot
   pm2 startup
   ```

### Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

---

## 🚂 Railway Deployment

1. **Create Railway account** and new project
2. **Connect GitHub repository**
3. **Add MySQL service** (or use external database)
4. **Set environment variables:**
   ```
   DB_HOST=${{MySQL.MYSQLHOST}}
   DB_USER=${{MySQL.MYSQLUSER}}
   DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
   DB_NAME=${{MySQL.MYSQLDATABASE}}
   DB_PORT=${{MySQL.MYSQLPORT}}
   NODE_ENV=production
   PORT=${{PORT}}
   ```
5. **Deploy**

### Railway Post-Deploy

Add to `package.json`:
```json
{
  "scripts": {
    "postdeploy": "npx prisma migrate deploy && npm run seed"
  }
}
```

---

## 🎨 Render Deployment

1. **Create new Web Service** on Render
2. **Connect GitHub repository**
3. **Build Settings:**
   - Build Command: `cd backend && npm install && npx prisma generate`
   - Start Command: `cd backend && node server.js`
4. **Add Environment Variables** (same as Railway)
5. **Deploy**

---

## ☁️ AWS/EC2 Deployment

### Using EC2

1. **Launch EC2 instance** (Ubuntu recommended)
2. **SSH into instance:**
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

3. **Install dependencies:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo npm install -g pm2
   ```

4. **Clone and setup:**
   ```bash
   git clone <your-repo-url>
   cd smc-digital-suite/backend
   npm install --production
   cp .env.example .env
   nano .env  # Configure
   npx prisma generate
   npx prisma migrate deploy
   ```

5. **Start with PM2:**
   ```bash
   pm2 start server.js --name smc-backend
   pm2 save
   pm2 startup
   ```

### Using ECS/Fargate

Use the provided `Dockerfile` and deploy to ECS:
```bash
# Build and push to ECR
docker build -t smc-backend .
docker tag smc-backend:latest <account>.dkr.ecr.<region>.amazonaws.com/smc-backend:latest
docker push <account>.dkr.ecr.<region>.amazonaws.com/smc-backend:latest

# Create ECS task definition and service
# (Use AWS Console or Terraform)
```

---

## 🔧 Common Issues & Solutions

### Issue 1: Database Connection Timeout

**Symptoms:**
```
pool timeout: failed to retrieve a connection from pool
```

**Solutions:**
1. Verify database is running and accessible
2. Check firewall rules (port 3306)
3. Verify credentials in `.env`
4. Test connection: `npm run test-db`

### Issue 2: Prisma Client Not Generated

**Symptoms:**
```
Cannot find module '@prisma/client'
```

**Solutions:**
```bash
cd backend
npx prisma generate
```

### Issue 3: Migration Errors

**Symptoms:**
```
Migration failed to apply
```

**Solutions:**
```bash
# Check migration status
npx prisma migrate status

# Resolve failed migration
npx prisma migrate resolve --rolled-back <migration-name>

# Or reset (WARNING: deletes data)
npx prisma migrate reset
```

### Issue 4: Port Already in Use

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solutions:**
```bash
# Find process using port
lsof -i :3000  # Linux/Mac
netstat -ano | findstr :3000  # Windows

# Kill process or change PORT in .env
```

### Issue 5: Environment Variables Not Loading

**Symptoms:**
```
Undefined environment variables
```

**Solutions:**
1. Ensure `.env` file exists in `backend/` directory
2. Verify `.env` is not in `.gitignore` (but don't commit it!)
3. Check variable names match exactly
4. Restart application after changing `.env`

### Issue 6: CORS Errors

**Symptoms:**
```
Access to fetch blocked by CORS policy
```

**Solutions:**
1. Update `CORS_ORIGIN` in `.env`
2. Or modify `server.js` CORS configuration
3. For development: `CORS_ORIGIN=*` (not recommended for production)

---

## 📝 Environment Variables Reference

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_HOST` | Database host | `localhost` or `db.example.com` |
| `DB_USER` | Database user | `root` |
| `DB_PASSWORD` | Database password | `your_password` |
| `DB_NAME` | Database name | `smc_dashboard` |
| `DB_PORT` | Database port | `3306` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` |
| `DATABASE_URL` | Full connection string | Auto-generated |
| `CORS_ORIGIN` | Allowed CORS origins | `*` |
| `INIT_SECRET` | Secret for `/api/init` endpoint | None |

---

## ✅ Deployment Checklist

Before deploying to production:

- [ ] Environment variables configured
- [ ] Database migrations applied (`npx prisma migrate deploy`)
- [ ] Prisma Client generated (`npx prisma generate`)
- [ ] Database seeded (optional: `npm run seed`)
- [ ] Health check endpoint working (`/api/health`)
- [ ] CORS configured correctly
- [ ] Logging configured
- [ ] Process manager setup (PM2, systemd, etc.)
- [ ] Reverse proxy configured (Nginx, etc.)
- [ ] SSL/TLS certificates installed
- [ ] Monitoring and alerts setup
- [ ] Backup strategy in place

---

## 🆘 Getting Help

If you encounter issues:

1. Check logs: `pm2 logs smc-backend` or `docker logs smc-backend`
2. Test database connection: `npm run test-db`
3. Verify environment variables
4. Check Prisma status: `npx prisma migrate status`
5. Review this guide's "Common Issues" section

---

**Last Updated:** 2024-12-08

