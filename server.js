// Express Backend for SMC Dashboard with Prisma
import express from 'express';
import cors from 'cors';
import { prisma, formatProduct, formatCategory } from './lib/db.js';
import { Prisma } from '@prisma/client';
import 'dotenv/config';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Modules equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increase limit for base64 images

// Middleware to prevent caching for all API routes - VERY AGGRESSIVE (for Vercel CDN)
app.use('/api', (req, res, next) => {
  res.set({
    'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0, private, s-maxage=0',
    'Pragma': 'no-cache',
    'Expires': '0',
    'Last-Modified': new Date().toUTCString(),
    'ETag': `"${Date.now()}-${Math.random()}"`,
    'X-Content-Type-Options': 'nosniff',
    'X-Accel-Expires': '0',
    'Vary': '*',
    // Vercel specific headers to prevent CDN caching
    'X-Vercel-Cache-Control': 'no-cache',
    'CDN-Cache-Control': 'no-cache',
    'Vercel-CDN-Cache-Control': 'no-cache',
    'Surrogate-Control': 'no-store'
  });
  next();
});

// Test database connection on startup
(async () => {
  try {
    await prisma.$connect();
    console.log('✅ Prisma Database connected successfully!');
  } catch (error) {
    console.error('❌ Prisma Database connection failed:', error.message);
    console.error('Please check:');
    console.error('1. DATABASE_URL is set correctly in .env file');
    console.error('2. Database is running and accessible');
    console.error('3. Database credentials are correct');
    console.error('4. Run: npx prisma migrate dev (to create tables)');
  }
})();

// Gallery column is handled by Prisma schema

// ==================== HEALTH CHECK ====================
app.get('/api/health', async (req, res) => {
  try {
    // Test database connection
    await prisma.$queryRawUnsafe('SELECT 1');
    
    res.json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// ==================== PRISMA MIGRATIONS ENDPOINT ====================
// This endpoint runs Prisma migrations on Vercel after deployment
// IMPORTANT: Protect this endpoint in production (add authentication)
app.post('/api/init', async (req, res) => {
  try {
    // Optional: Add authentication check here
    // const authToken = req.headers.authorization;
    // if (authToken !== `Bearer ${process.env.INIT_SECRET}`) {
    //   return res.status(401).json({ error: 'Unauthorized' });
    // }

    console.log('Running Prisma migrations...');
    
    // Change to backend directory
    const backendPath = __dirname;
    process.chdir(backendPath);
    
    // Run migrations
    try {
      execSync('npx prisma migrate deploy', { 
        stdio: 'inherit',
        cwd: backendPath,
        env: process.env
      });
      
      res.json({
        status: 'success',
        message: 'Migrations completed successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (migrationError) {
      console.error('Migration error:', migrationError);
      res.status(500).json({
        status: 'error',
        message: 'Migration failed',
        error: migrationError.message,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Init endpoint error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to run migrations',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// ==================== MIGRATION STATUS ====================
app.get('/api/migrations/status', async (req, res) => {
  try {
    // Check if migrations are up to date
    const backendPath = __dirname;
    
    try {
      const output = execSync('npx prisma migrate status', { 
        encoding: 'utf8',
        cwd: backendPath,
        env: process.env
      });
      
      res.json({
        status: 'ok',
        migrations: output,
        timestamp: new Date().toISOString(),
      });
    } catch (statusError) {
      res.status(500).json({
        status: 'error',
        message: 'Failed to check migration status',
        error: statusError.message,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to get migration status',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// ==================== PRODUCT CATEGORIES ROUTES ====================
app.get('/api/product-categories', async (req, res) => {
  try {
    // Set headers to prevent caching
    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    
    // Use $queryRawUnsafe to avoid Prisma MariaDB adapter issue with reserved keyword 'order'
    const categories = await prisma.$queryRawUnsafe(`
      SELECT * FROM product_categories 
      WHERE status = 'active'
      ORDER BY \`order\` ASC, id ASC
    `);
    
    res.json(categories.map(formatCategory));
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get products for a category
app.get('/api/product-categories/:id/products', async (req, res) => {
  try {
    // Set headers to prevent caching
    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    
    // Use $queryRawUnsafe with JOIN to avoid Prisma MariaDB adapter issue with reserved keyword 'order' in productCategory
    const categoryId = parseInt(req.params.id);
    const products = await prisma.$queryRawUnsafe(`
      SELECT 
        p.*,
        pc.id as productCategory_id,
        pc.name as productCategory_name,
        pc.nameAr as productCategory_nameAr,
        pc.slug as productCategory_slug,
        pc.\`order\` as productCategory_order,
        pc.status as productCategory_status,
        pc.created_at as productCategory_created_at,
        pc.updated_at as productCategory_updated_at
      FROM products p
      LEFT JOIN product_categories pc ON p.category_id = pc.id
      WHERE p.category_id = ? AND p.status = 'active'
      ORDER BY p.created_at DESC, p.id DESC
    `, categoryId);
    
    // Format products to match expected structure
    const formattedProducts = products.map(product => {
      const formatted = {
        ...product,
        productCategory: product.productCategory_id ? {
          id: product.productCategory_id,
          name: product.productCategory_name,
          nameAr: product.productCategory_nameAr,
          slug: product.productCategory_slug,
          order: product.productCategory_order,
          status: product.productCategory_status,
          createdAt: product.productCategory_created_at,
          updatedAt: product.productCategory_updated_at,
        } : null,
      };
      // Remove prefixed fields
      delete formatted.productCategory_id;
      delete formatted.productCategory_name;
      delete formatted.productCategory_nameAr;
      delete formatted.productCategory_slug;
      delete formatted.productCategory_order;
      delete formatted.productCategory_status;
      delete formatted.productCategory_created_at;
      delete formatted.productCategory_updated_at;
      return formatProduct(formatted);
    });
    
    res.json(formattedProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/product-categories/:id', async (req, res) => {
  try {
    // Set headers to prevent caching
    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    
    // Use $queryRawUnsafe to avoid Prisma MariaDB adapter issue with reserved keyword 'order'
    const categoryId = parseInt(req.params.id);
    const [category] = await prisma.$queryRawUnsafe(`
      SELECT * FROM product_categories WHERE id = ? LIMIT 1
    `, categoryId);
    
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json(formatCategory(category));
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/product-categories', async (req, res) => {
  try {
    console.log('POST /api/product-categories - Request received');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('Request headers:', JSON.stringify(req.headers, null, 2));
    
    const { name, nameAr, slug, order, status } = req.body;
    
    // Validate required fields
    if (!name || !nameAr || !slug) {
      const errorResponse = { 
        error: 'Missing required fields: name, nameAr, and slug are required',
        received: { name: !!name, nameAr: !!nameAr, slug: !!slug }
      };
      console.error('Validation error:', errorResponse);
      return res.status(400).json(errorResponse);
    }
    
    // Use $queryRawUnsafe to avoid Prisma MariaDB adapter issue with reserved keyword 'order'
    console.log('Inserting category into database...');
    await prisma.$queryRawUnsafe(`
      INSERT INTO product_categories (name, nameAr, slug, \`order\`, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, NOW(), NOW())
    `, name, nameAr || null, slug, order || 0, status || 'active');
    
    // Get the created category
    const [newCategory] = await prisma.$queryRawUnsafe(`
      SELECT * FROM product_categories WHERE slug = ? LIMIT 1
    `, slug);
    
    console.log('Category created with ID:', newCategory.id);
    
    if (!newCategory) {
      console.error('Category was created but could not be retrieved');
      return res.status(500).json({ error: 'Category was created but could not be retrieved' });
    }
    
    console.log('Category retrieved successfully:', newCategory.id);
    console.log('Sending response:', JSON.stringify(newCategory, null, 2));
    res.json(formatCategory(newCategory));
  } catch (error) {
    console.error('Error creating category:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage,
      name: error.name,
      errno: error.errno,
      syscall: error.syscall,
      address: error.address,
      port: error.port,
    });
    
    // Provide more specific error messages
    let errorMessage = 'Failed to create category';
    let statusCode = 500;
    
    // Database connection errors
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
      errorMessage = 'Database connection failed. Please check database configuration and ensure the database is accessible.';
      statusCode = 503; // Service Unavailable
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR' || error.code === 'ER_BAD_DB_ERROR') {
      errorMessage = 'Database authentication failed. Please check database credentials.';
      statusCode = 503;
    } else if (error.code === 'ER_DUP_ENTRY') {
      errorMessage = `Category with slug "${req.body.slug || 'unknown'}" already exists`;
      statusCode = 409; // Conflict
    } else if (error.code === 'ER_BAD_NULL_ERROR') {
      errorMessage = 'Required field is missing';
      statusCode = 400; // Bad Request
    } else if (error.code === 'ER_NO_SUCH_TABLE') {
      errorMessage = 'Database table not found. Please run database migrations.';
      statusCode = 503;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    // Add helpful context
    const errorResponse = { 
      error: errorMessage,
      code: error.code,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage,
      // Include helpful debugging info in development
      ...(process.env.NODE_ENV === 'development' && {
        details: error.stack,
        fullError: {
          name: error.name,
          message: error.message,
          code: error.code,
          errno: error.errno,
        }
      })
    };
    
    console.error('Sending error response:', JSON.stringify(errorResponse, null, 2));
    res.status(statusCode).json(errorResponse);
  }
});

app.put('/api/product-categories/:id', async (req, res) => {
  try {
    console.log('PUT /api/product-categories/:id - ID:', req.params.id, 'Body:', JSON.stringify(req.body, null, 2));
    
    const { name, nameAr, slug, order, status } = req.body;
    
    // Validate required fields
    if (!name || !nameAr || !slug) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, nameAr, and slug are required',
        received: { name: !!name, nameAr: !!nameAr, slug: !!slug }
      });
    }
    
    // Use $queryRawUnsafe to avoid Prisma MariaDB adapter issue with reserved keyword 'order'
    const categoryId = parseInt(req.params.id);
    await prisma.$queryRawUnsafe(`
      UPDATE product_categories 
      SET name = ?, 
          nameAr = ?, 
          slug = ?, 
          \`order\` = ?, 
          status = ?, 
          updated_at = NOW()
      WHERE id = ?
    `, name, nameAr || null, slug, order || 0, status || 'active', categoryId);
    
    // Get the updated category
    const [updatedCategory] = await prisma.$queryRawUnsafe(`
      SELECT * FROM product_categories WHERE id = ? LIMIT 1
    `, categoryId);
    
    if (!updatedCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    console.log('Category updated successfully:', updatedCategory.id);
    res.json(formatCategory(updatedCategory));
  } catch (error) {
    console.error('Error updating category:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage,
    });
    
    // Provide more specific error messages
    let errorMessage = 'Failed to update category';
    if (error.code === 'ER_DUP_ENTRY') {
      errorMessage = `Category with slug "${req.body.slug}" already exists`;
    } else if (error.code === 'ER_BAD_NULL_ERROR') {
      errorMessage = 'Required field is missing';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    res.status(500).json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      code: error.code
    });
  }
});

app.delete('/api/product-categories/:id', async (req, res) => {
  try {
    await prisma.productCategory.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ success: true });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Category not found' });
    }
    console.error('Error deleting category:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== PRODUCTS ROUTES ====================
app.get('/api/products', async (req, res) => {
  try {
    // Set headers to prevent ALL caching - very aggressive (for Vercel CDN)
    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0, private, s-maxage=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Last-Modified': new Date().toUTCString(),
      'ETag': `"${Date.now()}-${Math.random()}"`,
      'X-Content-Type-Options': 'nosniff',
      'X-Accel-Expires': '0',
      // Vercel specific headers to prevent CDN caching
      'X-Vercel-Cache-Control': 'no-cache',
      'CDN-Cache-Control': 'no-cache',
      'Vercel-CDN-Cache-Control': 'no-cache',
      'Surrogate-Control': 'no-store',
      'Vary': '*'
    });
    
    // Use $queryRawUnsafe with JOIN to avoid Prisma MariaDB adapter issue with reserved keyword 'order' in productCategory
    // Using $queryRawUnsafe to avoid serialization issues with template literals
    const products = await prisma.$queryRawUnsafe(`
      SELECT 
        p.*,
        pc.id as productCategory_id,
        pc.name as productCategory_name,
        pc.nameAr as productCategory_nameAr,
        pc.slug as productCategory_slug,
        pc.\`order\` as productCategory_order,
        pc.status as productCategory_status,
        pc.created_at as productCategory_created_at,
        pc.updated_at as productCategory_updated_at
      FROM products p
      LEFT JOIN product_categories pc ON p.category_id = pc.id
      ORDER BY p.created_at DESC, p.id DESC
    `);
    
    // Format products to match expected structure
    const formattedProducts = products.map(product => {
      const formatted = {
        ...product,
        productCategory: product.productCategory_id ? {
          id: product.productCategory_id,
          name: product.productCategory_name,
          nameAr: product.productCategory_nameAr,
          slug: product.productCategory_slug,
          order: product.productCategory_order,
          status: product.productCategory_status,
          createdAt: product.productCategory_created_at,
          updatedAt: product.productCategory_updated_at,
        } : null,
      };
      // Remove prefixed fields
      delete formatted.productCategory_id;
      delete formatted.productCategory_name;
      delete formatted.productCategory_nameAr;
      delete formatted.productCategory_slug;
      delete formatted.productCategory_order;
      delete formatted.productCategory_status;
      delete formatted.productCategory_created_at;
      delete formatted.productCategory_updated_at;
      return formatProduct(formatted);
    });
    
    res.json(formattedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    // Set headers to prevent ALL caching - very aggressive (for Vercel CDN)
    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0, private, s-maxage=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      'X-Vercel-Cache-Control': 'no-cache',
      'CDN-Cache-Control': 'no-cache',
      'Vercel-CDN-Cache-Control': 'no-cache',
      'Surrogate-Control': 'no-store'
    });
    
    // Use $queryRawUnsafe with JOIN to avoid Prisma MariaDB adapter issue with reserved keyword 'order' in productCategory
    const productId = parseInt(req.params.id);
    const [product] = await prisma.$queryRawUnsafe(`
      SELECT 
        p.*,
        pc.id as productCategory_id,
        pc.name as productCategory_name,
        pc.nameAr as productCategory_nameAr,
        pc.slug as productCategory_slug,
        pc.\`order\` as productCategory_order,
        pc.status as productCategory_status,
        pc.created_at as productCategory_created_at,
        pc.updated_at as productCategory_updated_at
      FROM products p
      LEFT JOIN product_categories pc ON p.category_id = pc.id
      WHERE p.id = ?
      LIMIT 1
    `, productId);
    
    if (!product) return res.status(404).json({ error: 'Product not found' });
    
    // Format product to match expected structure
    const formatted = {
      ...product,
      productCategory: product.productCategory_id ? {
        id: product.productCategory_id,
        name: product.productCategory_name,
        nameAr: product.productCategory_nameAr,
        slug: product.productCategory_slug,
        order: product.productCategory_order,
        status: product.productCategory_status,
        createdAt: product.productCategory_created_at,
        updatedAt: product.productCategory_updated_at,
      } : null,
    };
    // Remove prefixed fields
    delete formatted.productCategory_id;
    delete formatted.productCategory_name;
    delete formatted.productCategory_nameAr;
    delete formatted.productCategory_slug;
    delete formatted.productCategory_order;
    delete formatted.productCategory_status;
    delete formatted.productCategory_created_at;
    delete formatted.productCategory_updated_at;
    
    res.json(formatProduct(formatted));
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    // Set headers to prevent ALL caching - very aggressive (for Vercel CDN)
    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0, private, s-maxage=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      'X-Vercel-Cache-Control': 'no-cache',
      'CDN-Cache-Control': 'no-cache',
      'Vercel-CDN-Cache-Control': 'no-cache',
      'Surrogate-Control': 'no-store',
      'Vary': '*'
    });
    
    const { name, nameAr, category_id, category, status, views, description, descriptionAr, image, gallery, specifications_table } = req.body;
    
    // Log image info for debugging
    console.log('Creating product with image:', {
      hasImage: !!image,
      imageType: image ? (image.startsWith('data:image') ? 'base64' : 'url') : 'none',
      imageLength: image ? image.length : 0
    });
    
    // Use $queryRaw to avoid Prisma MariaDB adapter issue with reserved keyword 'order' in productCategory
    const galleryJson = gallery && Array.isArray(gallery) ? JSON.stringify(gallery) : null;
    const specsJson = specifications_table ? JSON.stringify(specifications_table) : null;
    
    await prisma.$queryRawUnsafe(`
      INSERT INTO products (name, nameAr, category_id, category, status, views, description, descriptionAr, image, gallery, specifications_table, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, name, nameAr || null, category_id || null, category || 'Mining', status || 'active', views || 0, description || null, descriptionAr || null, image || null, galleryJson, specsJson);
    
    // Get the created product with category
    const [newProduct] = await prisma.$queryRawUnsafe(`
      SELECT 
        p.*,
        pc.id as productCategory_id,
        pc.name as productCategory_name,
        pc.nameAr as productCategory_nameAr,
        pc.slug as productCategory_slug,
        pc.\`order\` as productCategory_order,
        pc.status as productCategory_status,
        pc.created_at as productCategory_created_at,
        pc.updated_at as productCategory_updated_at
      FROM products p
      LEFT JOIN product_categories pc ON p.category_id = pc.id
      ORDER BY p.id DESC
      LIMIT 1
    `);
    
    // Format product to match expected structure
    const formatted = {
      ...newProduct,
      productCategory: newProduct.productCategory_id ? {
        id: newProduct.productCategory_id,
        name: newProduct.productCategory_name,
        nameAr: newProduct.productCategory_nameAr,
        slug: newProduct.productCategory_slug,
        order: newProduct.productCategory_order,
        status: newProduct.productCategory_status,
        createdAt: newProduct.productCategory_created_at,
        updatedAt: newProduct.productCategory_updated_at,
      } : null,
    };
    // Remove prefixed fields
    delete formatted.productCategory_id;
    delete formatted.productCategory_name;
    delete formatted.productCategory_nameAr;
    delete formatted.productCategory_slug;
    delete formatted.productCategory_order;
    delete formatted.productCategory_status;
    delete formatted.productCategory_created_at;
    delete formatted.productCategory_updated_at;
    
    // Log retrieved product image info
    console.log('Retrieved product image:', {
      productId: formatted?.id,
      hasImage: !!formatted?.image,
      imageType: formatted?.image ? (formatted.image.startsWith('data:image') ? 'base64' : 'url') : 'none',
      imageLength: formatted?.image ? formatted.image.length : 0
    });
    
    res.json(formatProduct(formatted));
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to create product',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    // Set headers to prevent ALL caching - very aggressive (for Vercel CDN)
    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0, private, s-maxage=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      'X-Vercel-Cache-Control': 'no-cache',
      'CDN-Cache-Control': 'no-cache',
      'Vercel-CDN-Cache-Control': 'no-cache',
      'Surrogate-Control': 'no-store',
      'Vary': '*'
    });
    
    const { name, nameAr, category_id, category, status, views, description, descriptionAr, image, gallery, specifications_table } = req.body;
    
    // Log image info for debugging
    console.log('Updating product with image:', {
      productId: req.params.id,
      hasImage: !!image,
      imageType: image ? (image.startsWith('data:image') ? 'base64' : 'url') : 'none',
      imageLength: image ? image.length : 0
    });
    
    // Use $queryRaw to avoid Prisma MariaDB adapter issue with reserved keyword 'order' in productCategory
    const galleryJson = gallery && Array.isArray(gallery) ? JSON.stringify(gallery) : null;
    const specsJson = specifications_table ? JSON.stringify(specifications_table) : null;
    
    const productId = parseInt(req.params.id);
    await prisma.$queryRawUnsafe(`
      UPDATE products 
      SET name = ?, 
          nameAr = ?, 
          category_id = ?, 
          category = ?, 
          status = ?, 
          views = ?, 
          description = ?, 
          descriptionAr = ?, 
          image = ?, 
          gallery = ?, 
          specifications_table = ?, 
          updated_at = NOW()
      WHERE id = ?
    `, name, nameAr || null, category_id || null, category || 'Mining', status || 'active', views || 0, description || null, descriptionAr || null, image || null, galleryJson, specsJson, productId);
    
    // Get the updated product with category
    const [updatedProduct] = await prisma.$queryRawUnsafe(`
      SELECT 
        p.*,
        pc.id as productCategory_id,
        pc.name as productCategory_name,
        pc.nameAr as productCategory_nameAr,
        pc.slug as productCategory_slug,
        pc.\`order\` as productCategory_order,
        pc.status as productCategory_status,
        pc.created_at as productCategory_created_at,
        pc.updated_at as productCategory_updated_at
      FROM products p
      LEFT JOIN product_categories pc ON p.category_id = pc.id
      WHERE p.id = ?
      LIMIT 1
    `, productId);
    
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Format product to match expected structure
    const formatted = {
      ...updatedProduct,
      productCategory: updatedProduct.productCategory_id ? {
        id: updatedProduct.productCategory_id,
        name: updatedProduct.productCategory_name,
        nameAr: updatedProduct.productCategory_nameAr,
        slug: updatedProduct.productCategory_slug,
        order: updatedProduct.productCategory_order,
        status: updatedProduct.productCategory_status,
        createdAt: updatedProduct.productCategory_created_at,
        updatedAt: updatedProduct.productCategory_updated_at,
      } : null,
    };
    // Remove prefixed fields
    delete formatted.productCategory_id;
    delete formatted.productCategory_name;
    delete formatted.productCategory_nameAr;
    delete formatted.productCategory_slug;
    delete formatted.productCategory_order;
    delete formatted.productCategory_status;
    delete formatted.productCategory_created_at;
    delete formatted.productCategory_updated_at;
    
    // Log retrieved product image info
    console.log('Retrieved updated product image:', {
      productId: formatted?.id,
      hasImage: !!formatted?.image,
      imageType: formatted?.image ? (formatted.image.startsWith('data:image') ? 'base64' : 'url') : 'none',
      imageLength: formatted?.image ? formatted.image.length : 0
    });
    
    res.json(formatProduct(formatted));
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to update product',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await prisma.product.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ success: true });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Product not found' });
    }
    console.error('Error deleting product:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== NEWS ROUTES ====================
app.get('/api/news', async (req, res) => {
  try {
    const news = await prisma.news.findMany({
      orderBy: [
        { date: 'desc' },
        { id: 'desc' },
      ],
    });
    res.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/news/:id', async (req, res) => {
  try {
    const item = await prisma.news.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!item) return res.status(404).json({ error: 'News not found' });
    res.json(item);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/news', async (req, res) => {
  try {
    const { title, titleAr, date, category, views, status, content, contentAr, image } = req.body;
    const newNews = await prisma.news.create({
      data: {
        title,
        titleAr: titleAr || null,
        date: date ? new Date(date) : new Date(),
        category: category || null,
        views: views || 0,
        status: status || 'published',
        content: content || null,
        contentAr: contentAr || null,
        image: image || null,
      },
    });
    res.json(newNews);
  } catch (error) {
    console.error('Error creating news:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to create news',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.put('/api/news/:id', async (req, res) => {
  try {
    const { title, titleAr, date, category, views, status, content, contentAr, image } = req.body;
    const updatedNews = await prisma.news.update({
      where: { id: parseInt(req.params.id) },
      data: {
        title,
        titleAr: titleAr || null,
        date: date ? new Date(date) : undefined,
        category: category || null,
        views: views || 0,
        status: status || 'published',
        content: content || null,
        contentAr: contentAr || null,
        image: image || null,
      },
    });
    res.json(updatedNews);
  } catch (error) {
    console.error('Error updating news:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'News not found' });
    }
    res.status(500).json({ 
      error: error.message || 'Failed to update news',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.delete('/api/news/:id', async (req, res) => {
  try {
    await prisma.news.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ success: true });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'News not found' });
    }
    console.error('Error deleting news:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== USERS ROUTES ====================
app.get('/api/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { id: 'desc' },
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { name, email, role, status, permissions } = req.body;
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        role: role || 'viewer',
        status: status || 'active',
        permissions: permissions || [],
      },
    });
    res.json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'User with this email already exists' });
    }
    res.status(500).json({ 
      error: error.message || 'Failed to create user',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const { name, email, role, status, permissions } = req.body;
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name,
        email,
        role: role || 'viewer',
        status: status || 'active',
        permissions: permissions || [],
      },
    });
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to update user',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    await prisma.user.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ success: true });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }
    console.error('Error deleting user:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== CONTACTS ROUTES ====================
app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: [
        { date: 'desc' },
        { id: 'desc' },
      ],
    });
    res.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/contacts', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    const newContact = await prisma.contact.create({
      data: {
        name,
        email: email || null,
        phone: phone || null,
        message: message || null,
      },
    });
    res.json(newContact);
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/contacts/:id', async (req, res) => {
  try {
    const { name, email, phone, message, status } = req.body;
    const updatedContact = await prisma.contact.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name,
        email: email || null,
        phone: phone || null,
        message: message || null,
        status: status || 'new',
      },
    });
    res.json(updatedContact);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Contact not found' });
    }
    console.error('Error updating contact:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== COMPLAINTS ROUTES ====================
app.get('/api/complaints', async (req, res) => {
  try {
    const complaints = await prisma.complaint.findMany({
      orderBy: [
        { date: 'desc' },
        { id: 'desc' },
      ],
    });
    res.json(complaints);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/complaints', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const newComplaint = await prisma.complaint.create({
      data: {
        name,
        email: email || null,
        subject: subject || null,
        message: message || null,
      },
    });
    res.json(newComplaint);
  } catch (error) {
    console.error('Error creating complaint:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/complaints/:id', async (req, res) => {
  try {
    const { name, email, subject, message, status } = req.body;
    const updatedComplaint = await prisma.complaint.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name,
        email: email || null,
        subject: subject || null,
        message: message || null,
        status: status || 'pending',
      },
    });
    res.json(updatedComplaint);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Complaint not found' });
    }
    console.error('Error updating complaint:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== BANNERS ROUTES ====================
app.get('/api/banners', async (req, res) => {
  try {
    // Use $queryRawUnsafe to avoid Prisma MariaDB adapter issue with reserved keyword 'order'
    const banners = await prisma.$queryRawUnsafe(`
      SELECT * FROM banners 
      ORDER BY \`order\` ASC, id ASC
    `);
    res.json(banners);
  } catch (error) {
    console.error('Error fetching banners:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/banners', async (req, res) => {
  try {
    const { image, title, titleAr, subtitle, subtitleAr, description, descriptionAr, order, active } = req.body;
    // Use $queryRawUnsafe to avoid Prisma MariaDB adapter issue with reserved keyword 'order'
    await prisma.$queryRawUnsafe(`
      INSERT INTO banners (image, title, titleAr, subtitle, subtitleAr, description, descriptionAr, \`order\`, active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, image || null, title || null, titleAr || null, subtitle || null, subtitleAr || null, description || null, descriptionAr || null, order || 0, active !== undefined ? active : true);
    
    // Get the created banner (by getting the last inserted ID)
    const [newBanner] = await prisma.$queryRawUnsafe(`
      SELECT * FROM banners ORDER BY id DESC LIMIT 1
    `);
    res.json(newBanner);
  } catch (error) {
    console.error('Error creating banner:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to create banner',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.put('/api/banners/:id', async (req, res) => {
  try {
    const { image, title, titleAr, subtitle, subtitleAr, description, descriptionAr, order, active } = req.body;
    // Use $queryRawUnsafe to avoid Prisma MariaDB adapter issue with reserved keyword 'order'
    const bannerId = parseInt(req.params.id);
    await prisma.$queryRawUnsafe(`
      UPDATE banners 
      SET image = ?, 
          title = ?, 
          titleAr = ?, 
          subtitle = ?, 
          subtitleAr = ?, 
          description = ?, 
          descriptionAr = ?, 
          \`order\` = ?, 
          active = ?, 
          updated_at = NOW()
      WHERE id = ?
    `, image || null, title || null, titleAr || null, subtitle || null, subtitleAr || null, description || null, descriptionAr || null, order || 0, active !== undefined ? active : true, bannerId);
    
    // Get the updated banner
    const [updatedBanner] = await prisma.$queryRawUnsafe(`
      SELECT * FROM banners WHERE id = ? LIMIT 1
    `, bannerId);
    
    if (!updatedBanner) {
      return res.status(404).json({ error: 'Banner not found' });
    }
    
    res.json(updatedBanner);
  } catch (error) {
    console.error('Error updating banner:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to update banner',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.delete('/api/banners/:id', async (req, res) => {
  try {
    await prisma.banner.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ success: true });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Banner not found' });
    }
    console.error('Error deleting banner:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== TENDERS ROUTES ====================
app.get('/api/tenders', async (req, res) => {
  try {
    const tenders = await prisma.tender.findMany({
      orderBy: [
        { deadline: 'desc' },
        { id: 'desc' },
      ],
    });
    res.json(tenders);
  } catch (error) {
    console.error('Error fetching tenders:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/tenders/:id', async (req, res) => {
  try {
    const tender = await prisma.tender.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!tender) return res.status(404).json({ error: 'Tender not found' });
    res.json(tender);
  } catch (error) {
    console.error('Error fetching tender:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/tenders', async (req, res) => {
  try {
    const { title, titleAr, category, deadline, description, descriptionAr, status, documentFile, documentFileName } = req.body;
    const newTender = await prisma.tender.create({
      data: {
        title,
        titleAr: titleAr || null,
        category: category || null,
        deadline: deadline ? new Date(deadline) : null,
        description: description || null,
        descriptionAr: descriptionAr || null,
        status: status || 'active',
        documentFile: documentFile || null,
        documentFileName: documentFileName || null,
      },
    });
    res.json(newTender);
  } catch (error) {
    console.error('Error creating tender:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/tenders/:id', async (req, res) => {
  try {
    const { title, titleAr, category, deadline, description, descriptionAr, status, documentFile, documentFileName } = req.body;
    const updatedTender = await prisma.tender.update({
      where: { id: parseInt(req.params.id) },
      data: {
        title,
        titleAr: titleAr || null,
        category: category || null,
        deadline: deadline ? new Date(deadline) : undefined,
        description: description || null,
        descriptionAr: descriptionAr || null,
        status: status || 'active',
        documentFile: documentFile || null,
        documentFileName: documentFileName || null,
      },
    });
    res.json(updatedTender);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Tender not found' });
    }
    console.error('Error updating tender:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/tenders/:id', async (req, res) => {
  try {
    await prisma.tender.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ success: true });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Tender not found' });
    }
    console.error('Error deleting tender:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== TENDER SUBMISSIONS ROUTES ====================
app.post('/api/tenders/:id/submit', async (req, res) => {
  try {
    const { companyName, contactName, email, phone, files } = req.body;
    const newSubmission = await prisma.tenderSubmission.create({
      data: {
        tenderId: parseInt(req.params.id),
        companyName,
        contactName,
        email,
        phone: phone || null,
        files: files || [],
      },
    });
    res.json(newSubmission);
  } catch (error) {
    console.error('Error creating submission:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/tenders/:id/submissions', async (req, res) => {
  try {
    const submissions = await prisma.tenderSubmission.findMany({
      where: { tenderId: parseInt(req.params.id) },
      orderBy: { submittedAt: 'desc' },
    });
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/tender-submissions/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedSubmission = await prisma.tenderSubmission.update({
      where: { id: parseInt(req.params.id) },
      data: { status },
    });
    res.json(updatedSubmission);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Submission not found' });
    }
    console.error('Error updating submission:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== MEMBERS ROUTES ====================
app.get('/api/members', async (req, res) => {
  try {
    // Use $queryRawUnsafe to avoid Prisma MariaDB adapter issue with reserved keyword 'order'
    const members = await prisma.$queryRawUnsafe(`
      SELECT * FROM members 
      WHERE status = 'active'
      ORDER BY \`order\` ASC, id ASC
    `);
    res.json(members);
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/members/:id', async (req, res) => {
  try {
    // Use $queryRawUnsafe to avoid Prisma MariaDB adapter issue with reserved keyword 'order'
    const memberId = parseInt(req.params.id);
    const [member] = await prisma.$queryRawUnsafe(`
      SELECT * FROM members WHERE id = ? LIMIT 1
    `, memberId);
    if (!member) return res.status(404).json({ error: 'Member not found' });
    res.json(member);
  } catch (error) {
    console.error('Error fetching member:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/members', async (req, res) => {
  try {
    const { name, nameAr, title, titleAr, order, status } = req.body;
    // Use $queryRawUnsafe to avoid Prisma MariaDB adapter issue with reserved keyword 'order'
    await prisma.$queryRawUnsafe(`
      INSERT INTO members (name, nameAr, title, titleAr, \`order\`, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, name, nameAr || null, title || null, titleAr || null, order || 0, status || 'active');
    
    // Get the created member (by getting the last inserted ID)
    const [newMember] = await prisma.$queryRawUnsafe(`
      SELECT * FROM members ORDER BY id DESC LIMIT 1
    `);
    res.json(newMember);
  } catch (error) {
    console.error('Error creating member:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/members/:id', async (req, res) => {
  try {
    const { name, nameAr, title, titleAr, order, status } = req.body;
    // Use $queryRawUnsafe to avoid Prisma MariaDB adapter issue with reserved keyword 'order'
    const memberId = parseInt(req.params.id);
    await prisma.$queryRawUnsafe(`
      UPDATE members 
      SET name = ?, 
          nameAr = ?, 
          title = ?, 
          titleAr = ?, 
          \`order\` = ?, 
          status = ?, 
          updated_at = NOW()
      WHERE id = ?
    `, name, nameAr || null, title || null, titleAr || null, order || 0, status || 'active', memberId);
    
    // Get the updated member
    const [updatedMember] = await prisma.$queryRawUnsafe(`
      SELECT * FROM members WHERE id = ? LIMIT 1
    `, memberId);
    
    if (!updatedMember) {
      return res.status(404).json({ error: 'Member not found' });
    }
    
    res.json(updatedMember);
  } catch (error) {
    console.error('Error updating member:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/members/:id', async (req, res) => {
  try {
    await prisma.member.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ success: true });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Member not found' });
    }
    console.error('Error deleting member:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== CLIENTS ROUTES ====================
app.get('/api/clients', async (req, res) => {
  try {
    let clients;
    if (req.query.status === 'all') {
      // Use $queryRawUnsafe to avoid Prisma MariaDB adapter issue with reserved keyword 'order'
      clients = await prisma.$queryRawUnsafe(`
        SELECT * FROM clients 
        ORDER BY \`order\` ASC, id ASC
      `);
    } else {
      // Use $queryRawUnsafe to avoid Prisma MariaDB adapter issue with reserved keyword 'order'
      clients = await prisma.$queryRawUnsafe(`
        SELECT * FROM clients 
        WHERE status = 'active'
        ORDER BY \`order\` ASC, id ASC
      `);
    }
    res.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/clients/:id', async (req, res) => {
  try {
    const client = await prisma.client.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!client) return res.status(404).json({ error: 'Client not found' });
    res.json(client);
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/clients', async (req, res) => {
  try {
    const { name, nameAr, logo, website, order, status } = req.body;
    if (!name || !nameAr) {
      return res.status(400).json({ error: 'Name and nameAr are required' });
    }
    const newClient = await prisma.client.create({
      data: {
        name,
        nameAr,
        logo: logo || null,
        website: website || null,
        sortOrder: order || 0,
        status: status || 'active',
      },
    });
    res.json(newClient);
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/clients/:id', async (req, res) => {
  try {
    const { name, nameAr, logo, website, order, status } = req.body;
    const updatedClient = await prisma.client.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name,
        nameAr: nameAr || null,
        logo: logo || null,
        website: website || null,
        sortOrder: order || 0,
        status: status || 'active',
      },
    });
    res.json(updatedClient);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Client not found' });
    }
    console.error('Error updating client:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/clients/:id', async (req, res) => {
  try {
    await prisma.client.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ success: true });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Client not found' });
    }
    console.error('Error deleting client:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== FINANCIAL DATA ROUTES ====================

// ==================== FINANCIAL DATA ROUTES ====================
// Revenue
app.get('/api/financial/revenue', async (req, res) => {
  try {
    const data = await prisma.financialRevenue.findMany({
      orderBy: { year: 'asc' },
    });
    res.json(data);
  } catch (error) {
    console.error('Error fetching revenue:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/financial/revenue', async (req, res) => {
  try {
    const { year, revenue, profit } = req.body;
    const newData = await prisma.financialRevenue.upsert({
      where: { year },
      update: { revenue, profit },
      create: { year, revenue, profit },
    });
    res.json(newData);
  } catch (error) {
    console.error('Error creating/updating revenue:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/financial/revenue/:id', async (req, res) => {
  try {
    const { year, revenue, profit } = req.body;
    const updatedData = await prisma.financialRevenue.update({
      where: { id: parseInt(req.params.id) },
      data: { year, revenue, profit },
    });
    res.json(updatedData);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Revenue record not found' });
    }
    console.error('Error updating revenue:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/financial/revenue/:id', async (req, res) => {
  try {
    await prisma.financialRevenue.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ success: true });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Revenue record not found' });
    }
    console.error('Error deleting revenue:', error);
    res.status(500).json({ error: error.message });
  }
});

// Production
app.get('/api/financial/production', async (req, res) => {
  try {
    const data = await prisma.financialProduction.findMany({
      orderBy: { id: 'asc' },
    });
    res.json(data);
  } catch (error) {
    console.error('Error fetching production:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/financial/production', async (req, res) => {
  try {
    const { month, production, target } = req.body;
    const newData = await prisma.financialProduction.create({
      data: { month, production, target },
    });
    res.json(newData);
  } catch (error) {
    console.error('Error creating production:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/financial/production/:id', async (req, res) => {
  try {
    const { month, production, target } = req.body;
    const updatedData = await prisma.financialProduction.update({
      where: { id: parseInt(req.params.id) },
      data: { month, production, target },
    });
    res.json(updatedData);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Production record not found' });
    }
    console.error('Error updating production:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/financial/production/:id', async (req, res) => {
  try {
    await prisma.financialProduction.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ success: true });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Production record not found' });
    }
    console.error('Error deleting production:', error);
    res.status(500).json({ error: error.message });
  }
});

// Export
app.get('/api/financial/export', async (req, res) => {
  try {
    const data = await prisma.financialExport.findMany({
      orderBy: { id: 'asc' },
    });
    res.json(data);
  } catch (error) {
    console.error('Error fetching export:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/financial/export', async (req, res) => {
  try {
    const { name, value, color } = req.body;
    const newData = await prisma.financialExport.create({
      data: { name, value, color: color || '#204393' },
    });
    res.json(newData);
  } catch (error) {
    console.error('Error creating export:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/financial/export/:id', async (req, res) => {
  try {
    const { name, value, color } = req.body;
    const updatedData = await prisma.financialExport.update({
      where: { id: parseInt(req.params.id) },
      data: { name, value, color: color || '#204393' },
    });
    res.json(updatedData);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Export record not found' });
    }
    console.error('Error updating export:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/financial/export/:id', async (req, res) => {
  try {
    await prisma.financialExport.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ success: true });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Export record not found' });
    }
    console.error('Error deleting export:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== CHAT MESSAGES ROUTES ====================
app.get('/api/chat', async (req, res) => {
  try {
    const messages = await prisma.chatMessage.findMany({
      orderBy: { timestamp: 'desc' },
    });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newMessage = await prisma.chatMessage.create({
      data: { name, email, message },
    });
    res.json(newMessage);
  } catch (error) {
    console.error('Error creating chat message:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/chat/:id', async (req, res) => {
  try {
    const { reply, status } = req.body;
    const updatedMessage = await prisma.chatMessage.update({
      where: { id: parseInt(req.params.id) },
      data: {
        reply: reply || null,
        status: status || 'replied',
      },
    });
    res.json(updatedMessage);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Chat message not found' });
    }
    console.error('Error updating chat message:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== PAGE CONTENT ROUTES ====================
app.get('/api/page-content', async (req, res) => {
  try {
    const content = await prisma.pageContent.findMany();
    const result = {};
    content.forEach(item => {
      if (!result[item.page]) result[item.page] = {};
      result[item.page][item.key] = { en: item.valueEn, ar: item.valueAr };
    });
    res.json(result);
  } catch (error) {
    console.error('Error fetching page content:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/page-content', async (req, res) => {
  try {
    const { page, key, valueEn, valueAr } = req.body;
    const updated = await prisma.pageContent.upsert({
      where: { page_key: { page, key } },
      update: { valueEn: valueEn || null, valueAr: valueAr || null },
      create: { page, key, valueEn: valueEn || null, valueAr: valueAr || null },
    });
    res.json(updated);
  } catch (error) {
    console.error('Error updating page content:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== SITE SETTINGS ROUTES ====================
app.get('/api/settings', async (req, res) => {
  try {
    const settings = await prisma.siteSetting.findMany();
    const result = {};
    settings.forEach(item => {
      result[item.key] = { en: item.valueEn, ar: item.valueAr };
    });
    res.json(result);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/settings', async (req, res) => {
  try {
    const { key, valueEn, valueAr } = req.body;
    const updated = await prisma.siteSetting.upsert({
      where: { key },
      update: { valueEn: valueEn || null, valueAr: valueAr || null },
      create: { key, valueEn: valueEn || null, valueAr: valueAr || null },
    });
    res.json(updated);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== STATISTICS ROUTES ====================
app.get('/api/statistics/overview', async (req, res) => {
  try {
    const [totalProducts, totalNews, totalContacts, totalComplaints, viewsResult] = await Promise.all([
      prisma.product.count(),
      prisma.news.count(),
      prisma.contact.count(),
      prisma.complaint.count(),
      prisma.product.aggregate({ _sum: { views: true } }),
    ]);
    
    res.json({
      totalProducts,
      totalNews,
      totalContacts,
      totalComplaints,
      totalRevenue: '78M',
      monthlyGrowth: '+15%',
      totalViews: viewsResult._sum.views || 0,
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/statistics/monthly', async (req, res) => {
  res.json([
    { month: 'Jan', views: 1200, visitors: 800 },
    { month: 'Feb', views: 1900, visitors: 1200 },
    { month: 'Mar', views: 3000, visitors: 1800 },
    { month: 'Apr', views: 2780, visitors: 1900 },
    { month: 'May', views: 1890, visitors: 1300 },
    { month: 'Jun', views: 2390, visitors: 1500 },
  ]);
});

app.get('/api/statistics/product-views', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      select: { name: true, views: true },
      orderBy: { views: 'desc' },
    });
    res.json(products);
  } catch (error) {
    console.error('Error fetching product views:', error);
    res.status(500).json({ error: error.message });
  }
});

// Export for Vercel Serverless Functions
// This allows the app to work both as a standalone server and as a Vercel function
export default app;

// Start server only if not in Vercel environment
// Vercel will use the exported app, local dev will use app.listen
// ES Modules equivalent of require.main === module
if (process.env.VERCEL !== '1') {
  // Check if this file is being run directly (not imported)
  const isMainModule = import.meta.url === `file://${process.argv[1]}` || 
                        process.argv[1] && process.argv[1].endsWith('server.js');
  if (isMainModule) {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 MySQL Database: ${process.env.DB_NAME || 'smc_dashboard'}`);
    });
  }
}
