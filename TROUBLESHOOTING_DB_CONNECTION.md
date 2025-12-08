# Database Connection Troubleshooting Guide

## Problem: Pool Timeout Error

If you're seeing this error:
```
pool timeout: failed to retrieve a connection from pool after 10009ms
    (pool connections: active=0 idle=0 limit=10)
```

This means Prisma cannot establish a connection to your database server.

## Quick Diagnosis

Run the connection test script:
```bash
cd backend
npm run test-db
```

This will:
1. Display your current database configuration
2. Test basic MySQL connection
3. Test Prisma connection
4. Provide specific troubleshooting steps

## Common Causes & Solutions

### 1. Database Server Not Running

**Symptoms:**
- Connection timeout errors
- "ECONNREFUSED" errors
- Pool timeout errors

**Solution:**
- **Windows:** Check if MySQL/MariaDB service is running
  ```powershell
  # Check service status
  Get-Service -Name MySQL*
  # Or for MariaDB
  Get-Service -Name MariaDB*
  
  # Start the service if stopped
  Start-Service -Name MySQL*
  ```

- **Check if MySQL is listening on port 3306:**
  ```powershell
  netstat -an | findstr :3306
  ```

### 2. Incorrect Database Credentials

**Symptoms:**
- "Access denied" errors
- Pool timeout (if credentials are wrong, connection attempts fail)

**Solution:**
1. Check your `.env` file in `backend/` directory
2. Verify these variables are correct:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=smc_dashboard
   DB_PORT=3306
   ```

3. Test credentials manually:
   ```bash
   mysql -u root -p -h localhost
   ```

### 3. Database Doesn't Exist

**Symptoms:**
- Connection succeeds but queries fail
- "Unknown database" errors

**Solution:**
1. Create the database:
   ```sql
   CREATE DATABASE smc_dashboard CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. Or update `DB_NAME` in `.env` to an existing database

### 4. Firewall/Network Issues

**Symptoms:**
- Connection timeout
- "Connection refused" errors

**Solution:**
- Check Windows Firewall settings
- Ensure MySQL is configured to accept connections from localhost
- Check MySQL `bind-address` in `my.ini` or `my.cnf`:
  ```
  bind-address = 127.0.0.1
  # or
  bind-address = 0.0.0.0  # (less secure, allows remote connections)
  ```

### 5. Port Conflict

**Symptoms:**
- Connection timeout
- Port already in use errors

**Solution:**
1. Check if port 3306 is in use:
   ```powershell
   netstat -ano | findstr :3306
   ```

2. If using a different port, update `DB_PORT` in `.env`

### 6. Prisma Migrations Not Applied

**Symptoms:**
- Connection works but seed fails
- "Table doesn't exist" errors

**Solution:**
```bash
cd backend
npx prisma migrate dev
# or
npx prisma db push
```

## Step-by-Step Fix

1. **Verify Database Server is Running**
   ```powershell
   Get-Service MySQL*
   ```

2. **Test Basic Connection**
   ```bash
   cd backend
   npm run test-db
   ```

3. **Check Environment Variables**
   - Ensure `.env` file exists in `backend/` directory
   - Verify all database variables are set correctly

4. **Create Database (if needed)**
   ```sql
   CREATE DATABASE IF NOT EXISTS smc_dashboard 
   CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

5. **Run Migrations**
   ```bash
   cd backend
   npx prisma migrate dev
   ```

6. **Test Seed Again**
   ```bash
   npm run seed
   ```

## Environment Variables Template

Create or update `backend/.env`:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=smc_dashboard
DB_PORT=3306

# Or use DATABASE_URL directly
# DATABASE_URL="mysql://root:password@localhost:3306/smc_dashboard"

# Server Configuration
PORT=3001
NODE_ENV=development
```

## Additional Resources

- [Prisma Connection Pooling](https://www.prisma.io/docs/concepts/components/prisma-client/connection-management)
- [MySQL Connection Issues](https://dev.mysql.com/doc/refman/8.0/en/problems-connecting.html)
- [MariaDB Connection Troubleshooting](https://mariadb.com/kb/en/troubleshooting-connection-issues/)

## Still Having Issues?

1. Run the diagnostic script: `npm run test-db`
2. Check MySQL error logs (usually in MySQL data directory)
3. Verify Prisma Client is generated: `npx prisma generate`
4. Check Prisma schema is valid: `npx prisma validate`

