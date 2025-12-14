// Products Controller
import prisma from '../config/database.js';
import mysqlPool from '../config/mysqlPool.js';
import { formatProduct } from '../utils/formatters.js';

// Helper to format product from raw query
const formatProductFromRaw = (product) => {
  let gallery = product.gallery;
  if (gallery && typeof gallery === 'string') {
    try {
      gallery = JSON.parse(gallery);
    } catch (e) {
      gallery = null;
    }
  }
  
  let specificationsTable = product.specifications_table;
  if (specificationsTable && typeof specificationsTable === 'string') {
    try {
      specificationsTable = JSON.parse(specificationsTable);
    } catch (e) {
      specificationsTable = null;
    }
  }
  
  const formatted = {
    id: product.id,
    name: product.name,
    nameAr: product.nameAr,
    categoryId: product.category_id,
    category: product.category,
    status: product.status,
    views: product.views,
    description: product.description,
    descriptionAr: product.descriptionAr,
    image: product.image,
    gallery: gallery,
    specificationsTable: specificationsTable,
    createdAt: product.created_at,
    updatedAt: product.updated_at,
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
  return formatProduct(formatted);
};

export const getAllProducts = async (req, res, next) => {
  try {
    const [products] = await mysqlPool.execute(`
      SELECT 
        p.id,
        p.name,
        p.nameAr,
        p.category_id,
        p.category,
        p.status,
        p.views,
        p.description,
        p.descriptionAr,
        p.image,
        p.gallery,
        p.specifications_table,
        p.created_at,
        p.updated_at,
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
    
    res.json(products.map(formatProductFromRaw));
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.id);
    const [products] = await mysqlPool.execute(`
      SELECT 
        p.id,
        p.name,
        p.nameAr,
        p.category_id,
        p.category,
        p.status,
        p.views,
        p.description,
        p.descriptionAr,
        p.image,
        p.gallery,
        p.specifications_table,
        p.created_at,
        p.updated_at,
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
    `, [productId]);
    
    const product = products[0];
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(formatProductFromRaw(product));
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const { name, nameAr, category_id, category, status, views, description, descriptionAr, image, gallery, specifications_table } = req.body;
    
    const galleryJson = gallery && Array.isArray(gallery) ? JSON.stringify(gallery) : null;
    const specsJson = specifications_table ? JSON.stringify(specifications_table) : null;
    
    await mysqlPool.execute(`
      INSERT INTO products (name, nameAr, category_id, category, status, views, description, descriptionAr, image, gallery, specifications_table, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, [name, nameAr || null, category_id || null, category || 'Mining', status || 'active', views || 0, description || null, descriptionAr || null, image || null, galleryJson, specsJson]);
    
    const [products] = await mysqlPool.execute(`
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
    
    const newProduct = products[0];
    if (!newProduct) {
      return res.status(500).json({ error: 'Product was created but could not be retrieved' });
    }
    
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
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { name, nameAr, category_id, category, status, views, description, descriptionAr, image, gallery, specifications_table } = req.body;
    
    const galleryJson = gallery && Array.isArray(gallery) ? JSON.stringify(gallery) : null;
    const specsJson = specifications_table ? JSON.stringify(specifications_table) : null;
    const productId = parseInt(req.params.id);
    
    await mysqlPool.execute(`
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
    `, [name, nameAr || null, category_id || null, category || 'Mining', status || 'active', views || 0, description || null, descriptionAr || null, image || null, galleryJson, specsJson, productId]);
    
    const [products] = await mysqlPool.execute(`
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
    `, [productId]);
    
    const updatedProduct = products[0];
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
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
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.id);
    const [result] = await mysqlPool.execute(
      'DELETE FROM products WHERE id = ?',
      [productId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

