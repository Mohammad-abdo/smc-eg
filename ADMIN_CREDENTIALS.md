# 🔐 Admin Credentials

## Default Admin Account

After running the seed script (`npm run seed`), the following admin account is created:

### Admin User
- **Email**: `admin@smc.com`
- **Password**: `Admin@123`
- **Role**: `admin`
- **Status**: `active`
- **Permissions**: 
  - `read`
  - `write`
  - `delete`
  - `manage_users`
  - `manage_settings`

### ⚠️ Important Security Note

**CHANGE THE DEFAULT PASSWORD IMMEDIATELY AFTER FIRST LOGIN!**

The default password `Admin@123` is for initial setup only. For security, change it to a strong, unique password after your first login.

### Other Users Created

The seed script also creates these users:

1. **Editor User**
   - Email: `editor@smc.com`
   - Password: `Editor@123`
   - Role: `editor`
   - Permissions: `read`, `write`, `edit_products`, `edit_news`

2. **Viewer User**
   - Email: `viewer@smc.com`
   - Password: `Viewer@123`
   - Role: `viewer`
   - Permissions: `read`

3. **Manager User**
   - Email: `manager@smc.com`
   - Password: `Manager@123`
   - Role: `admin`
   - Permissions: `read`, `write`, `delete`, `manage_financials`

### Password Implementation

Password authentication has been implemented:

1. **Password field added** to the User model in `prisma/schema.prisma`
2. **Passwords are hashed** using bcrypt (10 salt rounds) before storage
3. **Default passwords** are set for all users (change after first login!)

### Setup Steps

1. **Install dependencies**:
```bash
npm install
```

2. **Create migration** (if not already done):
```bash
npx prisma migrate dev --name add_password_to_users
```

3. **Run seed script**:
```bash
npm run seed
```

### Password Security

- All passwords are hashed using bcrypt before storage
- Default passwords are provided for initial setup
- **IMPORTANT**: Change all default passwords after first login!

### Running the Seed

```bash
cd backend
npm run seed
```

This will create all users and populate the database with sample data.

---

**Last Updated**: 2024-12-08

