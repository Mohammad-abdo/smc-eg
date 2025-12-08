# 🚨 BACKEND SERVER NOT RUNNING - FIX THIS NOW

## ⚡ Quick Fix (Choose Your OS)

### Windows
**Double-click:** `start.bat`  
**OR run in terminal:**
```bash
cd backend
start.bat
```

### Linux/Mac
```bash
cd backend
chmod +x start.sh
./start.sh
```

### Manual Start (All OS)
```bash
cd backend
npm run dev
```

---

## ✅ What Should Happen

After running the command, you should see:

```
✅ Prisma Database connected successfully!
🚀 Server running on http://localhost:3001
📊 MySQL Database: smc_dashboard
```

**Keep the terminal window open!** Closing it stops the server.

---

## 🔍 Verify It's Working

### Option 1: Browser
Open: **http://localhost:3001/api/health**

Should show:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "..."
}
```

### Option 2: Terminal
Look for the success messages above.

---

## 🆘 If It Doesn't Work

### Error: .env file missing
1. Copy template: `cp env.template .env` (or `copy env.template .env` on Windows)
2. Edit `.env` with your database credentials
3. Try again

### Error: Database connection failed
```bash
# Test database connection
npm run test-db
```

Make sure:
- MySQL/MariaDB is running
- `.env` has correct database credentials
- Database `smc_dashboard` exists

### Error: Cannot find module
```bash
npm install
```

### Error: Prisma Client not found
```bash
npx prisma generate
```

### Error: Port 3001 already in use
```bash
# Windows
netstat -ano | findstr :3001

# Linux/Mac  
lsof -i :3001
```

Kill the process or change `PORT=3001` in `.env` to a different port.

---

## 📝 First Time Setup

If this is your first time:

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

# 5. Start server
npm run dev
```

---

## 🎯 Important Notes

1. **Keep terminal open** - Server runs in that terminal
2. **Use separate terminal** - Keep server running, use another for commands
3. **Port 3001** - Frontend expects backend on this port
4. **Database must be running** - MySQL/MariaDB service must be active

---

## ✅ Success Checklist

- [ ] Terminal shows "Server running on http://localhost:3001"
- [ ] http://localhost:3001/api/health works in browser
- [ ] Frontend connection errors disappear
- [ ] No more "ERR_CONNECTION_REFUSED" errors

---

**Once the server is running, your frontend will connect! 🎉**

