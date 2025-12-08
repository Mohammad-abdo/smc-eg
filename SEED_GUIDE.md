# 🌱 Complete Seed Guide

## Quick Start

```bash
cd backend
npm run seed
```

## What Gets Seeded

The seed script creates comprehensive data for **ALL** tables:

### ✅ Users (4 users)
- Admin user: `admin@smc.com`
- Editor user: `editor@smc.com`
- Viewer user: `viewer@smc.com`
- Manager user: `manager@smc.com`

### ✅ Product Categories (5 categories)
- Industrial Products
- Mining Products
- Construction Products
- Agricultural Products
- Energy Products

### ✅ Products (5 products)
- Heavy Duty Excavator
- Industrial Conveyor Belt
- Cement Mixer Truck
- Agricultural Tractor
- Industrial Generator

### ✅ News Articles (4 articles)
- New Product Launch
- Industry Conference 2024
- Partnership Announcement
- Sustainability Initiative

### ✅ Banners (3 banners)
- Welcome to SMC
- Quality Products
- Innovation & Excellence

### ✅ Board Members (5 members)
- CEO, CTO, CFO, COO, VP Sales

### ✅ Clients (6 clients)
- Various corporate clients

### ✅ Tenders (3 tenders)
- Mining Equipment Supply
- Industrial Conveyor System
- Construction Machinery Rental

### ✅ Tender Submissions (3 submissions)
- Sample submissions for tenders

### ✅ Contact Messages (4 messages)
- Sample contact form submissions

### ✅ Complaints (3 complaints)
- Sample customer complaints

### ✅ Chat Messages (3 messages)
- Sample chat conversations

### ✅ Financial Data
- Revenue records (4 years)
- Production records (12 months)
- Export records (4 regions)

### ✅ Site Settings (8 settings)
- Company information
- Social media links

### ✅ Page Content (7 content items)
- About page content
- Contact page content
- Home page content

## Admin Credentials

See [ADMIN_CREDENTIALS.md](./ADMIN_CREDENTIALS.md) for details.

**Email**: `admin@smc.com`
**Note**: Password field not in schema - implement authentication separately

## Troubleshooting

### Seed Fails with Connection Error
```bash
# Test database connection first
npm run test-db

# Check .env file exists and has correct credentials
```

### Seed Fails with Migration Error
```bash
# Run migrations first
npx prisma migrate deploy
```

### Want to Keep Existing Data
Edit `seed.js` and comment out the "Clear existing data" section:
```javascript
// await prisma.user.deleteMany();
// await prisma.product.deleteMany();
// etc...
```

## Customizing Seed Data

Edit `backend/prisma/seed.js` to:
- Add more records
- Change default values
- Modify user credentials
- Add custom data

## Re-running Seed

The seed script clears all data by default. To re-seed:

```bash
npm run seed
```

**Warning**: This will delete all existing data!

---

**All tables are seeded with comprehensive data! 🎉**

