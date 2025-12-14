// Helper functions to format database results
// This file provides compatibility layer for existing code

export function formatProduct(product) {
  if (!product) return null;
  
  // Parse JSON fields
  let gallery = product.gallery;
  if (gallery && typeof gallery === 'string') {
    try {
      gallery = JSON.parse(gallery);
    } catch (e) {
      gallery = [];
    }
  } else if (!gallery) {
    gallery = [];
  }
  
  let specificationsTable = product.specificationsTable || product.specifications_table;
  if (specificationsTable && typeof specificationsTable === 'string') {
    try {
      const parsed = JSON.parse(specificationsTable);
      if (parsed && !parsed.tables && parsed.columns) {
        specificationsTable = { tables: [parsed] };
      } else {
        specificationsTable = parsed;
      }
    } catch (e) {
      specificationsTable = null;
    }
  }
  
  return {
    ...product,
    gallery,
    specifications_table: specificationsTable,
    category_name: product.productCategory?.name,
    category_nameAr: product.productCategory?.nameAr,
    category_slug: product.productCategory?.slug,
    createdAt: product.createdAt?.toISOString?.() || product.created_at,
    updatedAt: product.updatedAt?.toISOString?.() || product.updated_at,
  };
}

export function formatCategory(category) {
  if (!category) return null;
  return {
    ...category,
    parent_id: null, // Always null (no subcategories)
    createdAt: category.createdAt?.toISOString?.() || category.created_at,
    updatedAt: category.updatedAt?.toISOString?.() || category.updated_at,
  };
}

