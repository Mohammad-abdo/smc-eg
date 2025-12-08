# Fix Failed Migration

## Problem
The migration `20251208125716_new` failed due to SQL syntax error (double backticks ``order`` instead of `order`).

## Solution

The migration file has been fixed. Now you need to resolve the failed migration:

### Step 1: Resolve the Failed Migration

Run this command in PowerShell (you may need to run PowerShell as Administrator or change execution policy):

```powershell
cd backend
npx prisma migrate resolve --rolled-back 20251208125716_new
```

**Alternative if npx doesn't work:**
```powershell
cd backend
node node_modules\.bin\prisma migrate resolve --rolled-back 20251208125716_new
```

### Step 2: Apply the Fixed Migration

After resolving, run:

```powershell
npx prisma migrate dev
```

Or:

```powershell
node node_modules\.bin\prisma migrate dev
```

### Alternative: Delete and Recreate Migration

If the resolve command doesn't work, you can:

1. **Delete the failed migration:**
   ```powershell
   Remove-Item -Recurse -Force prisma\migrations\20251208125716_new
   ```

2. **Create a new migration:**
   ```powershell
   npx prisma migrate dev --name fix_order_column
   ```

### What Was Fixed

The migration file had invalid SQL syntax:
- **Before:** ``order`` (double backticks - invalid)
- **After:** `order` (single backticks - correct)

The migration now correctly:
- Drops the `order` column
- Adds the `order` column back with the correct type

## Verification

After the migration succeeds, verify with:

```powershell
npx prisma migrate status
```

You should see all migrations as applied.

