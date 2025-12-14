# SMC Backend Architecture

## 📁 Project Structure

```
backend/
├── src/                 # Source code directory
│   ├── config/          # Configuration files
│   │   ├── database.js  # Prisma client and database connection
│   │   ├── cors.js      # CORS configuration
│   │   └── mysqlPool.js # MySQL2 pool for raw queries
│   │
│   ├── controllers/     # Request handlers (business logic)
│   │   ├── authController.js
│   │   ├── bannerController.js
│   │   ├── categoryController.js
│   │   ├── chatController.js
│   │   ├── clientController.js
│   │   ├── complaintController.js
│   │   ├── contactController.js
│   │   ├── financialController.js
│   │   ├── healthController.js
│   │   ├── memberController.js
│   │   ├── newsController.js
│   │   ├── productController.js
│   │   ├── settingsController.js
│   │   ├── statisticsController.js
│   │   ├── tenderController.js
│   │   └── userController.js
│   │
│   ├── middleware/      # Express middleware
│   │   ├── auth.js          # Authentication middleware
│   │   ├── errorHandler.js  # Global error handler
│   │   ├── noCache.js       # Cache control middleware
│   │   └── requestTimeout.js # Request timeout middleware
│   │
│   ├── routes/          # API route definitions
│   │   ├── index.js         # Main router (exports all routes)
│   │   ├── authRoutes.js
│   │   ├── bannerRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── chatRoutes.js
│   │   ├── clientRoutes.js
│   │   ├── complaintRoutes.js
│   │   ├── contactRoutes.js
│   │   ├── financialRoutes.js
│   │   ├── healthRoutes.js
│   │   ├── memberRoutes.js
│   │   ├── newsRoutes.js
│   │   ├── productRoutes.js
│   │   ├── settingsRoutes.js
│   │   ├── statisticsRoutes.js
│   │   ├── tenderRoutes.js
│   │   ├── tenderSubmissionRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── scripts/         # Utility scripts
│   │   ├── add-password-column.js
│   │   └── postinstall.js
│   │
│   └── utils/           # Utility functions
│       └── formatters.js    # Data formatting helpers
│
├── lib/                 # Legacy files (deprecated, kept for compatibility)
│   ├── db.js           # Re-exports from src/config/database.js
│   └── prisma.js       # Re-exports from src/config/database.js
│
├── prisma/              # Prisma ORM files
│   ├── schema.prisma    # Database schema
│   ├── seed.js          # Database seed script
│   └── migrations/      # Database migrations
│
├── server.js            # Express app entry point
├── package.json         # Dependencies and scripts
├── prisma.config.ts     # Prisma configuration
└── env.template         # Environment variables template
```

## 🔄 Request Flow

1. **Request** → Express app (`server.js`)
2. **Middleware** → CORS, body parser, timeout, no-cache
3. **Router** → Routes file (`src/routes/*.js`)
4. **Controller** → Business logic (`src/controllers/*.js`)
5. **Database** → Prisma Client (`src/config/database.js`)
6. **Response** → JSON response to client

## 📦 Key Dependencies

- **express**: Web framework
- **prisma**: ORM for database access
- **@prisma/client**: Prisma client library
- **@prisma/adapter-mariadb**: MySQL/MariaDB adapter for Prisma v7
- **mysql2**: Raw SQL queries when needed
- **bcrypt**: Password hashing
- **cors**: CORS middleware
- **dotenv**: Environment variables

## 🔐 Authentication

Currently using bcrypt for password hashing. JWT authentication can be added in `src/middleware/auth.js`.

## 🗄️ Database

- **Database**: MySQL/MariaDB
- **ORM**: Prisma v7
- **Connection**: Managed through `src/config/database.js`
- **Migrations**: Prisma migrations in `prisma/migrations/`

## 🚀 Best Practices

1. **Separation of Concerns**: Controllers handle business logic, routes handle routing
2. **Error Handling**: Centralized error handling in `src/middleware/errorHandler.js`
3. **Code Reusability**: Utilities in `src/utils/` directory
4. **Type Safety**: Use Prisma generated types
5. **Environment Variables**: All sensitive data in `.env` file

## 📝 Notes

- `lib/` directory contains deprecated files kept for backward compatibility
- Use `src/config/database.js` instead of `lib/prisma.js`
- Use `src/utils/formatters.js` instead of formatting functions in `lib/db.js`
- All source code is now organized in the `src/` directory
