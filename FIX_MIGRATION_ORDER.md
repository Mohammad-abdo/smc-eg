# Fix Migration Order Column Issue

## Problem
The migration failed because Prisma generated double backticks ``order`` instead of single backticks `order` for the reserved keyword column.

## Solution Applied
1. **Schema updated**: Changed `@map("`order`")` to `@map("order")` in all models
2. **Migration file fixed**: Changed ``order`` to `` `order` `` in the migration SQL

## Next Steps

### Step 1: Resolve the Failed Migration
Run this command in PowerShell:
```powershell
npx prisma migrate resolve --rolled-back 20251208141719
```

### Step 2: Apply the Fixed Migration
After resolving, run:
```powershell
npx prisma migrate deploy
```

Or for development:
```powershell
npx prisma migrate dev
```

### Alternative: Delete and Recreate
If the resolve command doesn't work:
```powershell
# Delete the failed migration
Remove-Item -Recurse -Force prisma\migrations\20251208141719

# Create a new migration
npx prisma migrate dev --name fix_order_column
```

## Files Changed
- `prisma/schema.prisma`: Removed backticks from `@map()` directives
- `prisma/migrations/20251208141719/migration.sql`: Fixed double backticks to single backticks

## Verification
After migration succeeds:
```powershell
npx prisma migrate status
```

All migrations should show as applied.

