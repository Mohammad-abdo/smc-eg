// Prisma Seed Script
// This script populates the database with initial data

import prisma from '../lib/prisma.js';

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Clear existing data (optional - comment out if you want to keep existing data)
  console.log('🗑️  Clearing existing data...');
  await prisma.tenderSubmission.deleteMany();
  await prisma.tender.deleteMany();
  await prisma.chatMessage.deleteMany();
  await prisma.client.deleteMany();
  await prisma.member.deleteMany();
  await prisma.financialExport.deleteMany();
  await prisma.financialProduction.deleteMany();
  await prisma.financialRevenue.deleteMany();
  await prisma.pageContent.deleteMany();
  await prisma.siteSetting.deleteMany();
  await prisma.product.deleteMany();
  await prisma.productCategory.deleteMany();
  await prisma.news.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.complaint.deleteMany();
  await prisma.user.deleteMany();
  console.log('✅ Existing data cleared\n');

  // Create Product Categories
  console.log('📦 Creating product categories...');
  // Use $queryRaw to avoid Prisma MariaDB adapter issue with reserved keyword 'order'
  await prisma.$queryRaw`
    INSERT INTO product_categories (name, nameAr, slug, \`order\`, status, created_at, updated_at)
    VALUES 
    ('Industrial Products', 'المنتجات الصناعية', 'industrial', 1, 'active', NOW(), NOW()),
    ('Mining Products', 'منتجات التعدين', 'mining', 2, 'active', NOW(), NOW()),
    ('Construction Products', 'منتجات البناء', 'construction', 3, 'active', NOW(), NOW())
  `;
  
  // Get created categories for product relations
  const categories = await prisma.$queryRaw`
    SELECT * FROM product_categories ORDER BY \`order\` ASC
  `;
  const industrialCategory = categories[0];
  const miningCategory = categories[1];
  const constructionCategory = categories[2];
  console.log('✅ Product categories created\n');

  // Create Products
  console.log('🛍️  Creating products...');
  const spec1 = JSON.stringify({
    tables: [{
      title: 'Technical Specifications',
      columns: ['Model', 'Engine Power', 'Weight'],
      rows: [
        ['EX-5000', '500 HP', '50 tons'],
        ['EX-3000', '300 HP', '30 tons'],
      ],
    }],
  });
  const spec2 = JSON.stringify({
    tables: [{
      title: 'Specifications',
      columns: ['Width', 'Length', 'Speed'],
      rows: [
        ['1.2m', '50m', '2 m/s'],
        ['0.8m', '30m', '1.5 m/s'],
      ],
    }],
  });
  const spec3 = JSON.stringify({
    tables: [{
      title: 'Specifications',
      columns: ['Capacity', 'Engine', 'Weight'],
      rows: [
        ['10 m³', '300 HP', '15 tons'],
        ['7 m³', '250 HP', '12 tons'],
      ],
    }],
  });

  await prisma.$queryRaw`
    INSERT INTO products (name, nameAr, category_id, category, status, views, description, descriptionAr, image, gallery, specifications_table, created_at, updated_at)
    VALUES 
    ('Heavy Duty Excavator', 'حفار ثقيل', ${miningCategory.id}, 'Mining', 'active', 150, 'High-performance excavator for mining operations', 'حفار عالي الأداء لعمليات التعدين', NULL, NULL, ${spec1}, NOW(), NOW()),
    ('Industrial Conveyor Belt', 'سير ناقل صناعي', ${industrialCategory.id}, 'Industrial', 'active', 200, 'Durable conveyor belt system for industrial applications', 'نظام سير ناقل متين للتطبيقات الصناعية', NULL, NULL, ${spec2}, NOW(), NOW()),
    ('Cement Mixer Truck', 'شاحنة خلاطة أسمنت', ${constructionCategory.id}, 'Construction', 'active', 120, 'Professional cement mixer for construction sites', 'خلاطة أسمنت احترافية لمواقع البناء', NULL, NULL, ${spec3}, NOW(), NOW())
  `;
  console.log('✅ Products created\n');

  // Create News
  console.log('📰 Creating news articles...');
  await prisma.news.createMany({
    data: [
      {
        title: 'New Product Launch',
        titleAr: 'إطلاق منتج جديد',
        date: new Date(),
        category: 'Company News',
        views: 50,
        status: 'published',
        content: 'We are excited to announce the launch of our new product line.',
        contentAr: 'نحن متحمسون للإعلان عن إطلاق خط منتجاتنا الجديد.',
        image: null,
      },
      {
        title: 'Industry Conference 2024',
        titleAr: 'مؤتمر الصناعة 2024',
        date: new Date(),
        category: 'Events',
        views: 75,
        status: 'published',
        content: 'Join us at the annual industry conference.',
        contentAr: 'انضم إلينا في مؤتمر الصناعة السنوي.',
        image: null,
      },
    ],
  });
  console.log('✅ News articles created\n');

  // Create Banners
  console.log('🎨 Creating banners...');
  // Use $queryRaw to avoid Prisma MariaDB adapter issue with reserved keyword 'order'
  await prisma.$queryRaw`
    INSERT INTO banners (image, title, titleAr, subtitle, subtitleAr, description, descriptionAr, \`order\`, active, created_at, updated_at)
    VALUES 
    (NULL, 'Welcome to SMC', 'مرحباً بكم في SMC', 'Your Trusted Partner', 'شريكك الموثوق', 'Leading provider of industrial and mining solutions', 'المزود الرائد للحلول الصناعية والتعدينية', 1, true, NOW(), NOW()),
    (NULL, 'Quality Products', 'منتجات عالية الجودة', 'Built to Last', 'مصممة لتدوم', 'Premium quality products for your business needs', 'منتجات عالية الجودة لاحتياجات عملك', 2, true, NOW(), NOW())
  `;
  console.log('✅ Banners created\n');

  // Create Users
  console.log('👤 Creating users...');
  await prisma.user.createMany({
    data: [
      {
        name: 'Admin User',
        email: 'admin@smc.com',
        role: 'admin',
        status: 'active',
        permissions: ['read', 'write', 'delete'],
      },
      {
        name: 'Editor User',
        email: 'editor@smc.com',
        role: 'editor',
        status: 'active',
        permissions: ['read', 'write'],
      },
      {
        name: 'Viewer User',
        email: 'viewer@smc.com',
        role: 'viewer',
        status: 'active',
        permissions: ['read'],
      },
    ],
  });
  console.log('✅ Users created\n');

  // Create Members
  console.log('👥 Creating board members...');
  // Use $queryRaw to avoid Prisma MariaDB adapter issue with reserved keyword 'order'
  await prisma.$queryRaw`
    INSERT INTO members (name, nameAr, title, titleAr, \`order\`, status, created_at, updated_at)
    VALUES 
    ('John Doe', 'جون دو', 'CEO', 'الرئيس التنفيذي', 1, 'active', NOW(), NOW()),
    ('Jane Smith', 'جين سميث', 'CTO', 'رئيس التكنولوجيا', 2, 'active', NOW(), NOW()),
    ('Ahmed Ali', 'أحمد علي', 'CFO', 'المدير المالي', 3, 'active', NOW(), NOW())
  `;
  console.log('✅ Board members created\n');

  // Create Clients
  console.log('🏢 Creating clients...');
  // Use $queryRaw to avoid Prisma MariaDB adapter issue with reserved keyword 'order'
  await prisma.$queryRaw`
    INSERT INTO clients (name, nameAr, logo, website, \`order\`, status, created_at, updated_at)
    VALUES 
    ('ABC Corporation', 'شركة ABC', NULL, 'https://abc.com', 1, 'active', NOW(), NOW()),
    ('XYZ Industries', 'صناعات XYZ', NULL, 'https://xyz.com', 2, 'active', NOW(), NOW()),
    ('Global Mining Co.', 'شركة التعدين العالمية', NULL, 'https://globalmining.com', 3, 'active', NOW(), NOW())
  `;
  console.log('✅ Clients created\n');

  // Create Financial Data
  console.log('💰 Creating financial data...');
  await prisma.financialRevenue.createMany({
    data: [
      { year: '2021', revenue: 50000000, profit: 10000000 },
      { year: '2022', revenue: 60000000, profit: 12000000 },
      { year: '2023', revenue: 70000000, profit: 15000000 },
      { year: '2024', revenue: 78000000, profit: 18000000 },
    ],
  });

  await prisma.financialProduction.createMany({
    data: [
      { month: 'January', production: 5000, target: 6000 },
      { month: 'February', production: 5500, target: 6000 },
      { month: 'March', production: 6000, target: 6000 },
      { month: 'April', production: 5800, target: 6000 },
    ],
  });

  await prisma.financialExport.createMany({
    data: [
      { name: 'Europe', value: 35.5, color: '#204393' },
      { name: 'Asia', value: 28.3, color: '#4CAF50' },
      { name: 'Africa', value: 20.1, color: '#FF9800' },
      { name: 'Americas', value: 16.1, color: '#F44336' },
    ],
  });
  console.log('✅ Financial data created\n');

  // Create Site Settings
  console.log('⚙️  Creating site settings...');
  await prisma.siteSetting.createMany({
    data: [
      { key: 'company_name', valueEn: 'SMC Digital Suite', valueAr: 'SMC الحلول الرقمية' },
      { key: 'company_email', valueEn: 'info@smc.com', valueAr: 'info@smc.com' },
      { key: 'company_phone', valueEn: '+1234567890', valueAr: '+1234567890' },
      { key: 'company_address', valueEn: '123 Main Street, City, Country', valueAr: '123 الشارع الرئيسي، المدينة، البلد' },
    ],
  });
  console.log('✅ Site settings created\n');

  // Create Page Content
  console.log('📄 Creating page content...');
  await prisma.pageContent.createMany({
    data: [
      {
        page: 'about',
        key: 'title',
        valueEn: 'About Us',
        valueAr: 'من نحن',
      },
      {
        page: 'about',
        key: 'description',
        valueEn: 'We are a leading provider of industrial and mining solutions.',
        valueAr: 'نحن مزود رائد للحلول الصناعية والتعدينية.',
      },
      {
        page: 'contact',
        key: 'title',
        valueEn: 'Contact Us',
        valueAr: 'اتصل بنا',
      },
      {
        page: 'contact',
        key: 'description',
        valueEn: 'Get in touch with our team.',
        valueAr: 'تواصل مع فريقنا.',
      },
    ],
  });
  console.log('✅ Page content created\n');

  console.log('✅ Database seed completed successfully!\n');
  console.log('📊 Summary:');
  console.log(`   - ${await prisma.productCategory.count()} categories`);
  console.log(`   - ${await prisma.product.count()} products`);
  console.log(`   - ${await prisma.news.count()} news articles`);
  console.log(`   - ${await prisma.banner.count()} banners`);
  console.log(`   - ${await prisma.user.count()} users`);
  console.log(`   - ${await prisma.member.count()} board members`);
  console.log(`   - ${await prisma.client.count()} clients`);
  console.log(`   - ${await prisma.financialRevenue.count()} revenue records`);
  console.log(`   - ${await prisma.siteSetting.count()} site settings`);
  console.log(`   - ${await prisma.pageContent.count()} page content items\n`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
