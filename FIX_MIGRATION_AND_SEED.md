# Fix Migration and Seed Database

## Issue 1: Migration Failed - Tables Already Exist

**Error:** `Table 'product_categories' already exists`

**Solution:** Mark the migration as applied since tables already exist:

```powershell
npx prisma migrate resolve --applied 20251208141719
```

## Issue 2: Seed Database

### Step 1: Generate Prisma Client
```powershell
npx prisma generate
```

### Step 2: Run the Seed Script
```powershell
npm run seed
```

Or directly:
```powershell
node prisma/seed.js
```

## Complete Setup Process

Run these commands in order:

```powershell
# 1. Generate Prisma Client (if not already done)
npx prisma generate

# 2. Resolve the failed migration
npx prisma migrate resolve --applied 20251208141719

# 3. Seed the database
npm run seed
```

## Alternative: If Migration Resolution Doesn't Work

If you're getting errors, you can use `db push` instead:

```powershell
# This syncs schema without using migrations
npx prisma db push

# Then seed
npm run seed
```

## What the Seed Creates

- **Users:** admin@smc.com (Admin@123), editor@smc.com (Editor@123), etc.
- **Product Categories:** Mining Equipment categories
- **Products:** Sample products
- **News:** Sample news articles
- **Banners:** Homepage banners
- **Members:** Board members
- **Clients:** Client logos
- **Financial Data:** Revenue, production, export data
- **Settings:** Site settings

## Troubleshooting

### Error: "Cannot find module 'bcrypt'"
```powershell
npm install
```

### Error: "Prisma Client not generated"
```powershell
npx prisma generate
```

### Error: "Database connection failed"
Check your `.env` file has correct DATABASE_URL or DB_* variables.

### Error: "Table doesn't exist"
Run migrations first:
```powershell
npx prisma migrate deploy
```


