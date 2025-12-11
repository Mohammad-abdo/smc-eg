# SMC Dashboard Backend API

Backend API for Sinai Manganese Company Dashboard built with Express.js, Prisma ORM, and MySQL/MariaDB.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## 🔧 Prerequisites

- **Node.js** 20.19+ (required for Prisma 7.0.1+)
- **MySQL/MariaDB** 8.0+ or access to a remote database
- **npm** or **yarn** package manager

---

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   cp env.template .env
   ```

4. **Configure environment variables** (see [Configuration](#configuration))

---

## ⚙️ Configuration

Edit the `.env` file with your configuration:

### Local Development:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=smc_dashboard
DB_PORT=3306
PORT=3000
NODE_ENV=development
FRONTEND_URL=https://smc-frontend-weld.vercel.app
```

### DigitalOcean Managed MySQL:
```env
DB_HOST=your-db-host.db.ondigitalocean.com
DB_PORT=25060
DB_USER=doadmin
DB_PASSWORD=your_digitalocean_password
DB_NAME=defaultdb
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.com
```

### Using DATABASE_URL (Alternative):
```env
DATABASE_URL="mysql://user:password@host:port/database"
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.com
```

**Environment Variables:**
- `DB_HOST` - Database host
- `DB_PORT` - Database port (default: 3306)
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name
- `DATABASE_URL` - Full database connection URL (overrides individual DB_* variables)
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `FRONTEND_URL` - Frontend URL for CORS

---

## 🗄️ Database Setup

### 1. Create Database

**Using MySQL CLI:**
```bash
mysql -u root -p
CREATE DATABASE smc_dashboard;
EXIT;
```

### 2. Generate Prisma Client

```bash
npm run prisma:generate
```

### 3. Run Migrations

**Development (creates migration files):**
```bash
npm run prisma:migrate
```

**Production (applies existing migrations):**
```bash
npm run prisma:migrate:deploy
```

**Or push schema directly (development only):**
```bash
npm run prisma:push
```

### 4. Seed Database (Optional)

Populate database with initial data:

```bash
npm run seed
```

**Default Admin Credentials:**
- Email: `admin@smc.com`
- Password: `admin123`

**⚠️ Important:** Change admin password in production!

### 5. Verify Database Connection

```bash
npm run test-db
```

### 6. Open Prisma Studio (Optional)

```bash
npm run prisma:studio
```

Access at: `http://localhost:5555`

---

## 🚀 Running the Server

### Development Mode (with auto-reload):

```bash
npm run dev
```

### Production Mode:

```bash
npm start
```

### Using PM2 (Production):

```bash
# Install PM2 globally
npm install -g pm2

# Start with PM2
pm2 start ecosystem.config.js --env production

# Or start server.js directly
pm2 start server.js --name smc-backend

# View logs
pm2 logs smc-backend

# Monitor
pm2 monit

# Stop
pm2 stop smc-backend

# Save PM2 process list
pm2 save

# Setup PM2 to start on system boot
pm2 startup
```

Server will start on `http://localhost:3000` (or your configured PORT).

### Health Check

Test if the server is running:

```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2024-..."
}
```

---

## 📡 API Endpoints

### Health Check
- `GET /api/health` - Check server and database status

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Product Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### News
- `GET /api/news` - Get all news
- `GET /api/news/:id` - Get news by ID
- `POST /api/news` - Create new news
- `PUT /api/news/:id` - Update news
- `DELETE /api/news/:id` - Delete news

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Contacts
- `GET /api/contacts` - Get all contacts
- `GET /api/contacts/:id` - Get contact by ID
- `PUT /api/contacts/:id` - Update contact status

### Complaints
- `GET /api/complaints` - Get all complaints
- `GET /api/complaints/:id` - Get complaint by ID
- `PUT /api/complaints/:id` - Update complaint status

### Banners
- `GET /api/banners` - Get all banners
- `GET /api/banners/:id` - Get banner by ID
- `POST /api/banners` - Create new banner
- `PUT /api/banners/:id` - Update banner
- `DELETE /api/banners/:id` - Delete banner

### Members
- `GET /api/members` - Get all members
- `GET /api/members/:id` - Get member by ID
- `POST /api/members` - Create new member
- `PUT /api/members/:id` - Update member
- `DELETE /api/members/:id` - Delete member

### Clients
- `GET /api/clients` - Get all clients
- `GET /api/clients/:id` - Get client by ID
- `POST /api/clients` - Create new client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Statistics
- `GET /api/statistics/overview` - Get overview statistics
- `GET /api/statistics/monthly` - Get monthly data
- `GET /api/statistics/product-views` - Get product views

### Financial
- `GET /api/financial` - Get all financial records
- `GET /api/financial/:id` - Get financial record by ID
- `POST /api/financial` - Create new financial record
- `PUT /api/financial/:id` - Update financial record
- `DELETE /api/financial/:id` - Delete financial record

### Chat
- `GET /api/chat` - Get all chat messages
- `POST /api/chat` - Send chat message

### Initialization
- `POST /api/init` - Run Prisma migrations (protected endpoint)

---

## 🗃️ Database Schema

The database schema is defined in `prisma/schema.prisma`. Main models include:

- **User** - System users
- **Product** - Products with gallery and specifications
- **ProductCategory** - Product categories
- **News** - News articles
- **Contact** - Contact form submissions
- **Complaint** - Customer complaints
- **Banner** - Homepage banners
- **Member** - Team members
- **Client** - Client companies
- **FinancialExport** - Financial records
- **ChatMessage** - Chat messages

View the full schema: `prisma/schema.prisma`

---

## 🚢 Deployment

### DigitalOcean App Platform

1. **Push code to GitHub**

2. **Create App in DigitalOcean:**
   - Go to DigitalOcean → Apps → Create App
   - Connect your GitHub repository
   - Select branch: `main`

3. **Configure Build Settings:**
   - **Build Command:** `npm ci --production && npm run prisma:generate`
   - **Run Command:** `npm start`
   - **HTTP Port:** `3000`

4. **Set Environment Variables:**
   ```env
   NODE_ENV=production
   PORT=3000
   DB_HOST=your-db-host.db.ondigitalocean.com
   DB_PORT=25060
   DB_USER=doadmin
   DB_PASSWORD=your_password
   DB_NAME=defaultdb
   FRONTEND_URL=https://your-frontend-url.com
   ```

5. **Configure Health Check:**
   - **HTTP Path:** `/api/health`
   - **Initial Delay:** 10 seconds
   - **Period:** 10 seconds
   - **Timeout:** 5 seconds

6. **Deploy:**
   - Click "Deploy" or push to GitHub for auto-deploy

7. **Run Migrations:**
   After first deployment, connect via SSH or console:
   ```bash
   npx prisma migrate deploy
   npm run seed  # Optional
   ```

### DigitalOcean Droplet (Manual Server)

1. **SSH into your Droplet:**
   ```bash
   ssh root@your-droplet-ip
   ```

2. **Install Node.js 20:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Install PM2:**
   ```bash
   sudo npm install -g pm2
   ```

4. **Clone and Setup:**
   ```bash
   git clone <repository-url>
   cd backend
   npm ci --production
   npm run prisma:generate
   ```

5. **Configure Environment:**
   ```bash
   cp env.template .env
   nano .env  # Edit with your settings
   ```

6. **Run Migrations:**
   ```bash
   npm run prisma:migrate:deploy
   npm run seed  # Optional
   ```

7. **Start with PM2:**
   ```bash
   pm2 start ecosystem.config.js --env production
   pm2 save
   pm2 startup
   ```

### Docker Deployment

**Build image:**
```bash
npm run docker:build
```

**Run container:**
```bash
npm run docker:run
```

**Or use Docker Compose:**
```bash
npm run docker:compose
```

---

## 🔍 Troubleshooting

### Database Connection Issues

**Error: `pool timeout`**
- Check database credentials in `.env`
- Verify database is running and accessible
- Check firewall rules
- Increase timeout in `lib/prisma.js`

**Error: `Access denied for user`**
- Verify username and password
- Check user has proper permissions
- Ensure database exists

**Error: `Unknown database`**
- Create database: `CREATE DATABASE smc_dashboard;`
- Or update `DB_NAME` in `.env`

### Prisma Issues

**Error: `PrismaClientConstructorValidationError`**
- Ensure Prisma Client is generated: `npm run prisma:generate`
- Check `lib/prisma.js` has correct adapter configuration

**Error: `Migration failed`**
- Check database connection
- Verify schema is valid: `npx prisma validate`
- Reset migrations if needed: `npx prisma migrate reset` (⚠️ deletes data)

**Error: `Table already exists`**
- Mark migration as applied: `npx prisma migrate resolve --applied <migration-name>`
- Or use: `npx prisma db push` (development only)

### Server Issues

**Error: `Port already in use`**
- Change `PORT` in `.env`
- Or kill process using port:
  ```bash
  # Windows
  netstat -ano | findstr :3000
  taskkill /PID <pid> /F
  
  # Linux/Mac
  lsof -ti:3000 | xargs kill
  ```

**Error: `Cannot find module`**
- Install dependencies: `npm install`
- Verify Node.js version: `node --version` (must be 20.19+)

### CORS Issues

**Error: `CORS policy blocked`**
- Add your frontend URL to `FRONTEND_URL` in `.env`
- Check `server.js` CORS configuration
- Verify frontend is sending correct headers

---

## 📝 Scripts

Available npm scripts:

- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Create and apply migrations (development)
- `npm run prisma:migrate:deploy` - Apply migrations (production)
- `npm run prisma:push` - Push schema to database (development)
- `npm run prisma:studio` - Open Prisma Studio
- `npm run seed` - Seed database with initial data
- `npm run test-db` - Test database connection
- `npm run check-db` - Check database configuration

---

## 🛠️ Technology Stack

- **Runtime:** Node.js 20+
- **Framework:** Express.js
- **ORM:** Prisma 7.0.1
- **Database:** MySQL/MariaDB
- **Authentication:** bcrypt
- **CORS:** cors middleware

---

## 📄 License

ISC

---

## 👤 Support

For issues and questions, please open an issue on GitHub or contact the development team.

---

## 🔄 Version History

- **1.0.0** - Initial release
  - Full CRUD API for all entities
  - Prisma ORM integration
  - MySQL/MariaDB support
  - CORS configuration
  - Health check endpoint
  - Database seeding
  - Deployment configurations
