# SMC Dashboard Backend API

Backend API for Sinai Manganese Company Dashboard.

## Installation

```bash
npm install
```

## Run

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### News
- `GET /api/news` - Get all news
- `GET /api/news/:id` - Get news by ID
- `POST /api/news` - Create new news
- `PUT /api/news/:id` - Update news
- `DELETE /api/news/:id` - Delete news

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Contacts
- `GET /api/contacts` - Get all contacts
- `PUT /api/contacts/:id` - Update contact

### Complaints
- `GET /api/complaints` - Get all complaints
- `PUT /api/complaints/:id` - Update complaint

### Banners
- `GET /api/banners` - Get all banners
- `POST /api/banners` - Create new banner
- `PUT /api/banners/:id` - Update banner
- `DELETE /api/banners/:id` - Delete banner

### Statistics
- `GET /api/statistics/overview` - Get overview statistics
- `GET /api/statistics/monthly` - Get monthly data
- `GET /api/statistics/product-views` - Get product views

## Data Storage

Data is stored in JSON files in the `data/` directory:
- `products.json`
- `news.json`
- `users.json`
- `contacts.json`
- `complaints.json`
- `banners.json`

## Deployment

For production deployment, use services like:
- Railway
- Render
- Heroku
- Vercel (Serverless Functions)
- DigitalOcean

Set `PORT` environment variable if needed.

