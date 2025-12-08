# 🚀 START HERE - Quick Deployment Guide

## ⚡ Fastest Way to Deploy (Choose One)

### Option 1: Docker (2 minutes) ⭐ Recommended
```bash
cd backend
cp env.template .env
# Edit .env with your database credentials
docker-compose up -d
```

### Option 2: Traditional Server (5 minutes)
```bash
cd backend
cp env.template .env
# Edit .env with your database credentials

# Linux/Mac
bash deploy.sh
pm2 start ecosystem.config.js

# Windows
.\deploy.ps1
```

### Option 3: Cloud Platform (3 minutes)
- **Vercel**: Connect GitHub → Set Root: `backend` → Add env vars → Deploy
- **Railway**: Connect GitHub → Add MySQL → Set env vars → Deploy
- **Render**: Connect GitHub → Set env vars → Deploy

---

## 📋 Required Configuration

### 1. Create `.env` file
```bash
cp env.template .env
```

### 2. Edit `.env` with your values
```env
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=smc_dashboard
DB_PORT=3306
PORT=3000
NODE_ENV=production
```

### 3. Verify Database Connection
```bash
npm run test-db
```

---

## ✅ Post-Deployment

### Check Health
```bash
curl http://localhost:3000/api/health
```

### View Logs
```bash
# Docker
docker-compose logs -f backend

# PM2
pm2 logs smc-backend

# Systemd
sudo journalctl -u smc-backend -f
```

---

## 📚 Need More Help?

- **Complete Guide**: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **All Options**: [ALL_DEPLOYMENT_OPTIONS.md](./ALL_DEPLOYMENT_OPTIONS.md)
- **Quick Reference**: [QUICK_DEPLOY.md](./QUICK_DEPLOY.md)
- **Troubleshooting**: [TROUBLESHOOTING_DB_CONNECTION.md](./TROUBLESHOOTING_DB_CONNECTION.md)

---

## 🆘 Common Issues

**Database connection fails?**
→ Check `.env` file and database credentials
→ Run: `npm run test-db`

**Port already in use?**
→ Change `PORT` in `.env` or kill existing process

**Prisma errors?**
→ Run: `npx prisma generate`

---

**Ready to deploy! 🎉**

