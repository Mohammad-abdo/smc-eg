# 🚀 Quick Start - Backend Server

## ⚠️ Connection Refused Error?

If you see `ERR_CONNECTION_REFUSED` errors, the backend server is not running!

## ✅ Quick Fix (3 Steps)

### Step 1: Navigate to Backend Directory
```bash
cd backend
```

### Step 2: Check Environment File
```bash
# Windows
if not exist .env copy env.template .env

# Linux/Mac
[ ! -f .env ] && cp env.template .env
```

Then edit `.env` and set:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=smc_dashboard
DB_PORT=3306
PORT=3001
NODE_ENV=development
```

### Step 3: Start the Server

**Option A: Development Mode (with auto-reload)**
```bash
npm run dev
```

**Option B: Production Mode**
```bash
npm start
```

You should see:
```
✅ Prisma Database connected successfully!
Server running on port 3001
```

---

## 🔍 Verify It's Working

Open in browser or use curl:
```bash
curl http://localhost:3001/api/health
```

Should return:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "..."
}
```

---

## 🆘 Troubleshooting

### Port Already in Use?
```bash
# Windows
netstat -ano | findstr :3001

# Linux/Mac
lsof -i :3001
```

Change PORT in `.env` or kill the process using the port.

### Database Connection Fails?
```bash
# Test database connection
npm run test-db
```

Check your `.env` file has correct database credentials.

### Prisma Client Not Generated?
```bash
npx prisma generate
```

### Need to Run Migrations?
```bash
npx prisma migrate deploy
```

---

## 📝 Full Setup (First Time)

If this is your first time:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Setup environment:**
   ```bash
   cp env.template .env
   # Edit .env with your database credentials
   ```

3. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

4. **Run migrations:**
   ```bash
   npx prisma migrate deploy
   ```

5. **Seed database (optional):**
   ```bash
   npm run seed
   ```

6. **Start server:**
   ```bash
   npm run dev
   ```

---

## 🎯 Default Ports

- **Backend**: `3001` (or set via `PORT` in `.env`)
- **Frontend**: `8080` (Vite default)
- **Database**: `3306` (MySQL default)

Make sure your frontend is configured to use `http://localhost:3001/api`

---

**Once the server is running, your frontend should connect successfully! ✅**

