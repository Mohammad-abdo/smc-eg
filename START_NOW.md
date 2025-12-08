# 🚨 START BACKEND SERVER NOW

## ⚡ Quick Start (Copy & Paste)

Open a **NEW terminal window** and run:

```bash
cd backend
npm run dev
```

**That's it!** The server will start on port 3001.

---

## ✅ What You Should See

When the server starts successfully, you'll see:

```
✅ Prisma Database connected successfully!
🚀 Server running on http://localhost:3001
📊 MySQL Database: smc_dashboard
```

---

## 🔍 Verify Server is Running

### Option 1: Check Browser
Open: http://localhost:3001/api/health

Should show:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "..."
}
```

### Option 2: Check Terminal
Look for the messages above in your terminal.

---

## 🆘 If It Doesn't Start

### Error: Cannot find module
```bash
cd backend
npm install
```

### Error: Database connection failed
```bash
# 1. Check .env file exists
cd backend
ls .env  # or dir .env on Windows

# 2. If .env doesn't exist, create it:
cp env.template .env
# Then edit .env with your database credentials

# 3. Test database connection:
npm run test-db
```

### Error: Prisma Client not found
```bash
cd backend
npx prisma generate
```

### Error: Port already in use
```bash
# Windows - Find what's using port 3001:
netstat -ano | findstr :3001

# Linux/Mac:
lsof -i :3001

# Kill the process or change PORT in .env
```

---

## 📝 Complete First-Time Setup

If you haven't set up before:

```bash
# Navigate to backend
cd backend

# 1. Install dependencies
npm install

# 2. Create .env file
cp env.template .env

# 3. Edit .env file - add your database credentials:
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=smc_dashboard
# DB_PORT=3306
# PORT=3001

# 4. Generate Prisma Client
npx prisma generate

# 5. Run migrations (create tables)
npx prisma migrate deploy

# 6. Start server
npm run dev
```

---

## 🎯 Important Notes

1. **Keep the terminal open** - The server runs in that terminal
2. **Don't close the terminal** - Closing it stops the server
3. **Use a separate terminal** - Keep this one running, use another for other commands
4. **Port 3001** - Make sure nothing else is using this port

---

## ✅ Success Checklist

- [ ] Terminal shows "Server running on http://localhost:3001"
- [ ] http://localhost:3001/api/health works in browser
- [ ] Frontend can now connect (no more connection errors)

---

**Once the server is running, your frontend errors will disappear! 🎉**

