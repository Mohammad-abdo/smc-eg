# ⚡ Quick Deployment Guide

## 🚀 Fastest Way to Deploy

### Option 1: Docker (Recommended - 2 minutes)

```bash
cd backend
cp .env.example .env
# Edit .env with your database credentials
docker-compose up -d
```

### Option 2: Traditional Server (5 minutes)

```bash
cd backend
cp .env.example .env
# Edit .env with your database credentials

# Linux/Mac
bash deploy.sh

# Windows
.\deploy.ps1

# Start with PM2
pm2 start ecosystem.config.js --env production
```

### Option 3: Vercel (3 minutes)

1. Connect GitHub repo to Vercel
2. Set Root Directory: `backend`
3. Add environment variables
4. Deploy

---

## 📋 Required Environment Variables

Create `backend/.env`:

```env
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=smc_dashboard
DB_PORT=3306
PORT=3000
NODE_ENV=production
```

---

## ✅ Post-Deployment Checklist

- [ ] Database connection working (`npm run test-db`)
- [ ] Migrations applied (`npx prisma migrate deploy`)
- [ ] Health check passing (`curl http://localhost:3000/api/health`)
- [ ] Server running (check logs)

---

## 🆘 Common Issues

**Database connection fails?**
- Check `.env` file exists and has correct credentials
- Verify database is running and accessible
- Test: `npm run test-db`

**Port already in use?**
- Change `PORT` in `.env`
- Or kill process: `lsof -i :3000` (Linux/Mac) or `netstat -ano | findstr :3000` (Windows)

**Prisma errors?**
- Run: `npx prisma generate`
- Then: `npx prisma migrate deploy`

---

For detailed instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

