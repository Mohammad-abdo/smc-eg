// Script to update all endpoints to use Prisma
// This script updates the server.js file to replace raw SQL queries with Prisma

const fs = require('fs');
const path = require('path');

const serverPath = path.join(__dirname, '../server.js');
let serverContent = fs.readFileSync(serverPath, 'utf8');

// Update POST /api/products
serverContent = serverContent.replace(
  /const result = await query\(\s*'INSERT INTO products[^']*'[^;]*;/s,
  `const newProduct = await prisma.product.create({
      data: {
        name,
        nameAr: nameAr || null,
        categoryId: category_id || null,
        category: category || 'Mining',
        status: status || 'active',
        views: views || 0,
        description: description || null,
        descriptionAr: descriptionAr || null,
        image: image || null,
        gallery: gallery && Array.isArray(gallery) ? gallery : null,
        specificationsTable: specifications_table || null,
      },
      include: {
        productCategory: true,
      },
    });`
);

serverContent = serverContent.replace(
  /const newProduct = await queryOne\(`[^`]*`[^;]*;/s,
  `// Product already created above`
);

// Update PUT /api/products
serverContent = serverContent.replace(
  /await query\(\s*'UPDATE products[^']*'[^;]*;/s,
  `const updatedProduct = await prisma.product.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name,
        nameAr: nameAr || null,
        categoryId: category_id || null,
        category: category || 'Mining',
        status: status || 'active',
        views: views || 0,
        description: description || null,
        descriptionAr: descriptionAr || null,
        image: image || null,
        gallery: gallery && Array.isArray(gallery) ? gallery : null,
        specificationsTable: specifications_table || null,
      },
      include: {
        productCategory: true,
      },
    });`
);

serverContent = serverContent.replace(
  /const updatedProduct = await queryOne\(`[^`]*`[^;]*;/s,
  `// Product already updated above`
);

// Update DELETE /api/products
serverContent = serverContent.replace(
  /await query\('DELETE FROM products WHERE id = \?', \[req\.params\.id\]\);/,
  `await prisma.product.delete({
      where: { id: parseInt(req.params.id) },
    });`
);

// Update GET /api/news
serverContent = serverContent.replace(
  /const news = await query\('SELECT \* FROM news ORDER BY date DESC, id DESC'\);/,
  `const news = await prisma.news.findMany({
      orderBy: [
        { date: 'desc' },
        { id: 'desc' },
      ],
    });`
);

// Update GET /api/news/:id
serverContent = serverContent.replace(
  /const item = await queryOne\('SELECT \* FROM news WHERE id = \?', \[req\.params\.id\]\);/,
  `const item = await prisma.news.findUnique({
      where: { id: parseInt(req.params.id) },
    });`
);

// Update POST /api/news
serverContent = serverContent.replace(
  /const result = await query\(\s*'INSERT INTO news[^']*'[^;]*;/s,
  `const newNews = await prisma.news.create({
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
    });`
);

serverContent = serverContent.replace(
  /const newNews = await queryOne\('SELECT \* FROM news WHERE id = \?', \[result\.insertId\]\);/,
  `// News already created above`
);

// Update PUT /api/news/:id
serverContent = serverContent.replace(
  /await query\(\s*'UPDATE news[^']*'[^;]*;/s,
  `const updatedNews = await prisma.news.update({
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
    });`
);

serverContent = serverContent.replace(
  /const updatedNews = await queryOne\('SELECT \* FROM news WHERE id = \?', \[req\.params\.id\]\);/,
  `// News already updated above`
);

// Update DELETE /api/news/:id
serverContent = serverContent.replace(
  /await query\('DELETE FROM news WHERE id = \?', \[req\.params\.id\]\);/,
  `await prisma.news.delete({
      where: { id: parseInt(req.params.id) },
    });`
);

fs.writeFileSync(serverPath, serverContent, 'utf8');
console.log('✅ Updated server.js to use Prisma');

