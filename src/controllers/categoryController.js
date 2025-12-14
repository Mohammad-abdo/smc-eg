// Product Categories Controller
import prisma from '../config/database.js';
import mysqlPool from '../config/mysqlPool.js';
import { formatCategory, formatProduct } from '../utils/formatters.js';

export const getAllCategories = async (req, res, next) => {
  try {
    const [categories] = await mysqlPool.execute(`
      SELECT * FROM product_categories 
      WHERE status = 'active'
      ORDER BY \`order\` ASC, id ASC
    `);
    res.json(categories.map(formatCategory));
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (req, res, next) => {
  try {
    const categoryId = parseInt(req.params.id);
    const [categories] = await mysqlPool.execute(`
      SELECT * FROM product_categories WHERE id = ? LIMIT 1
    `, [categoryId]);
    
    const category = categories[0];
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(formatCategory(category));
  } catch (error) {
    next(error);
  }
};

export const getCategoryProducts = async (req, res, next) => {
  try {
    const categoryId = parseInt(req.params.id);
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
      WHERE p.category_id = ? AND p.status = 'active'
      ORDER BY p.created_at DESC, p.id DESC
    `, [categoryId]);
    
    const formattedProducts = products.map(product => {
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
    });
    
    res.json(formattedProducts);
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name, nameAr, slug, order, status } = req.body;
    
    if (!name || !nameAr || !slug) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, nameAr, and slug are required',
        received: { name: !!name, nameAr: !!nameAr, slug: !!slug }
      });
    }
    
    await mysqlPool.execute(`
      INSERT INTO product_categories (name, nameAr, slug, \`order\`, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, NOW(), NOW())
    `, [name, nameAr || null, slug, order || 0, status || 'active']);
    
    const [categories] = await mysqlPool.execute(`
      SELECT * FROM product_categories WHERE slug = ? LIMIT 1
    `, [slug]);
    
    const newCategory = categories[0];
    if (!newCategory) {
      return res.status(500).json({ error: 'Category was created but could not be retrieved' });
    }
    
    res.json(formatCategory(newCategory));
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { name, nameAr, slug, order, status } = req.body;
    
    if (!name || !nameAr || !slug) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, nameAr, and slug are required',
        received: { name: !!name, nameAr: !!nameAr, slug: !!slug }
      });
    }
    
    const categoryId = parseInt(req.params.id);
    await mysqlPool.execute(`
      UPDATE product_categories 
      SET name = ?, 
          nameAr = ?, 
          slug = ?, 
          \`order\` = ?, 
          status = ?, 
          updated_at = NOW()
      WHERE id = ?
    `, [name, nameAr || null, slug, order || 0, status || 'active', categoryId]);
    
    const [categories] = await mysqlPool.execute(`
      SELECT * FROM product_categories WHERE id = ? LIMIT 1
    `, [categoryId]);
    
    const updatedCategory = categories[0];
    if (!updatedCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json(formatCategory(updatedCategory));
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    await prisma.productCategory.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ success: true });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Category not found' });
    }
    next(error);
  }
};

