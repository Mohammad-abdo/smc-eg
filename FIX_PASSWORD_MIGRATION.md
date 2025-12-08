# Fix Password Migration Issue

## Problem
The password field was added to the schema, but the database doesn't have the column yet. Also, there's a migration issue with the `order` field that prevents `prisma db push` from working.

## Solution: Manually Add Password Column (Recommended)

Since `prisma generate` already worked, you just need to add the column to the database:

### Step 1: Add Password Column to Database

Connect to your MySQL/MariaDB database and run:

```sql
ALTER TABLE users ADD COLUMN password VARCHAR(255) NULL;
```

**Or use MySQL command line:**
```bash
mysql -u root -p smc_dashboard
```
Then paste:
```sql
ALTER TABLE users ADD COLUMN password VARCHAR(255) NULL;
exit;
```

**Or use a MySQL client like MySQL Workbench, phpMyAdmin, or DBeaver**

### Step 2: Run Seed Script

After adding the column, run:
```bash
npm run seed
```

## Alternative: If you can't access MySQL directly

You can use Prisma Studio to run SQL:
```bash
npx prisma studio
```
Then go to the database view and run the SQL command there.

## After Fixing

Once the password column is added to the database, the seed script should work correctly.

## Admin Credentials

- Email: `admin@smc.com`
- Password: `Admin@123`

