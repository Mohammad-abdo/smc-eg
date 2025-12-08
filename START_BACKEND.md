# 🚀 Start Backend Server - Quick Guide

## ⚡ Fastest Way to Start

```bash
cd backend
npm run dev
```

That's it! The server will start on port **3001**.

---

## 📋 Prerequisites

### 1. Environment File
Make sure you have `.env` file:
```bash
cd backend
cp env.template .env
```

Edit `.env` with your database credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=smc_dashboard
DB_PORT=3306
PORT=3001
NODE_ENV=development
```

### 2. Database Running
Make sure MySQL/MariaDB is running:
```bash
# Windows
Get-Service MySQL*

# Linux/Mac
sudo systemctl status mysql
```

### 3. Dependencies Installed
```bash
cd backend
npm install
```

### 4. Prisma Client Generated
```bash
npx prisma generate
```

---

## 🎯 Start Commands

### Development (Recommended)
```bash
npm run dev
```
- Auto-reloads on file changes
- Better error messages
- Uses nodemon

### Production
```bash
npm start
```
- No auto-reload
- Optimized for production

---

## ✅ Verify Server is Running

### Check Health Endpoint
```bash
curl http://localhost:3001/api/health
```

Or open in browser:
```
http://localhost:3001/api/health
```

Expected response:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2024-12-08T..."
}
```

### Check Server Logs
You should see:
```
✅ Prisma Database connected successfully!
Server running on port 3001
```

---

## 🔧 First Time Setup

If you haven't set up before:

```bash
cd backend

# 1. Install dependencies
npm install

# 2. Create .env file
cp env.template .env
# Edit .env with your database credentials

# 3. Generate Prisma Client
npx prisma generate

# 4. Run migrations
npx prisma migrate deploy

# 5. Seed database (optional)
npm run seed

# 6. Start server
npm run dev
```

---

## 🆘 Common Issues

### Error: Cannot find module '@prisma/client'
```bash
npx prisma generate
```

### Error: Database connection failed
```bash
# Test connection
npm run test-db

# Check .env file has correct credentials
# Make sure database is running
```

### Error: Port 3001 already in use
```bash
# Find process using port
# Windows:
netstat -ano | findstr :3001

# Linux/Mac:
lsof -i :3001

# Kill process or change PORT in .env
```

### Error: Migration failed
```bash
npx prisma migrate deploy
```

---

## 📝 Port Configuration

- **Default Port**: `3001`
- **Change Port**: Set `PORT=3001` in `.env` file
- **Frontend expects**: `http://localhost:3001/api`

---

## 🎉 Success!

Once you see:
```
✅ Prisma Database connected successfully!
Server running on port 3001
```

Your backend is ready! The frontend should now be able to connect.

---

**Need more help?** See [QUICK_START_SERVER.md](./QUICK_START_SERVER.md)

