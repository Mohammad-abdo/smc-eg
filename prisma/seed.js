// Prisma Seed Script - Complete Database Seeding
// This script populates the database with initial data for all tables
// Run with: npm run seed

import prisma from '../lib/prisma.js';
import bcrypt from 'bcrypt';

async function main() {
  console.log('🌱 Starting comprehensive database seed...\n');

  try {
    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🗑️  Clearing existing data...');
    await prisma.tenderSubmission.deleteMany();
    await prisma.tender.deleteMany();
    await prisma.chatMessage.deleteMany();
    await prisma.contact.deleteMany();
    await prisma.complaint.deleteMany();
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
    await prisma.user.deleteMany();
    console.log('✅ Existing data cleared\n');

    // ==================== CREATE USERS ====================
    console.log('👤 Creating users...');
    
    // Hash passwords
    const saltRounds = 10;
    const adminPassword = 'Admin@123'; // Default admin password
    const editorPassword = 'Editor@123';
    const viewerPassword = 'Viewer@123';
    const managerPassword = 'Manager@123';
    
    const hashedAdminPassword = await bcrypt.hash(adminPassword, saltRounds);
    const hashedEditorPassword = await bcrypt.hash(editorPassword, saltRounds);
    const hashedViewerPassword = await bcrypt.hash(viewerPassword, saltRounds);
    const hashedManagerPassword = await bcrypt.hash(managerPassword, saltRounds);
    
    const users = await prisma.user.createMany({
      data: [
        {
          name: 'Admin User',
          email: 'admin@smc.com',
          password: hashedAdminPassword,
          role: 'admin',
          status: 'active',
          permissions: ['read', 'write', 'delete', 'manage_users', 'manage_settings'],
        },
        {
          name: 'Editor User',
          email: 'editor@smc.com',
          password: hashedEditorPassword,
          role: 'editor',
          status: 'active',
          permissions: ['read', 'write', 'edit_products', 'edit_news'],
        },
        {
          name: 'Viewer User',
          email: 'viewer@smc.com',
          password: hashedViewerPassword,
          role: 'viewer',
          status: 'active',
          permissions: ['read'],
        },
        {
          name: 'Manager User',
          email: 'manager@smc.com',
          password: hashedManagerPassword,
          role: 'admin',
          status: 'active',
          permissions: ['read', 'write', 'delete', 'manage_financials'],
        },
      ],
    });
    console.log('✅ Users created\n');
    console.log('📧 ADMIN CREDENTIALS:');
    console.log('   Email: admin@smc.com');
    console.log('   Password: Admin@123');
    console.log('   Role: admin');
    console.log('   ⚠️  IMPORTANT: Change this password after first login!\n');
    console.log('📧 OTHER USER CREDENTIALS:');
    console.log('   Editor: editor@smc.com / Editor@123');
    console.log('   Viewer: viewer@smc.com / Viewer@123');
    console.log('   Manager: manager@smc.com / Manager@123\n');

    // ==================== CREATE PRODUCT CATEGORIES ====================
    console.log('📦 Creating product categories...');
    await prisma.$queryRaw`
      INSERT INTO product_categories (name, nameAr, slug, \`order\`, status, created_at, updated_at)
      VALUES 
      ('Industrial Products', 'المنتجات الصناعية', 'industrial', 1, 'active', NOW(), NOW()),
      ('Mining Products', 'منتجات التعدين', 'mining', 2, 'active', NOW(), NOW()),
      ('Construction Products', 'منتجات البناء', 'construction', 3, 'active', NOW(), NOW()),
      ('Agricultural Products', 'المنتجات الزراعية', 'agricultural', 4, 'active', NOW(), NOW()),
      ('Energy Products', 'منتجات الطاقة', 'energy', 5, 'active', NOW(), NOW())
    `;
    
    const categories = await prisma.$queryRaw`
      SELECT * FROM product_categories ORDER BY \`order\` ASC
    `;
    const industrialCategory = categories[0];
    const miningCategory = categories[1];
    const constructionCategory = categories[2];
    const agriculturalCategory = categories[3];
    const energyCategory = categories[4];
    console.log('✅ Product categories created\n');

    // ==================== CREATE PRODUCTS ====================
    console.log('🛍️  Creating products...');
    const spec1 = JSON.stringify({
      tables: [{
        title: 'Technical Specifications',
        columns: ['Model', 'Engine Power', 'Weight', 'Capacity'],
        rows: [
          ['EX-5000', '500 HP', '50 tons', '5 m³'],
          ['EX-3000', '300 HP', '30 tons', '3 m³'],
          ['EX-2000', '200 HP', '20 tons', '2 m³'],
        ],
      }],
    });
    const spec2 = JSON.stringify({
      tables: [{
        title: 'Conveyor Specifications',
        columns: ['Width', 'Length', 'Speed', 'Load Capacity'],
        rows: [
          ['1.2m', '50m', '2 m/s', '500 kg/m'],
          ['0.8m', '30m', '1.5 m/s', '300 kg/m'],
          ['0.6m', '20m', '1 m/s', '200 kg/m'],
        ],
      }],
    });
    const spec3 = JSON.stringify({
      tables: [{
        title: 'Mixer Specifications',
        columns: ['Capacity', 'Engine', 'Weight', 'Rotation Speed'],
        rows: [
          ['10 m³', '300 HP', '15 tons', '15 RPM'],
          ['7 m³', '250 HP', '12 tons', '12 RPM'],
          ['5 m³', '200 HP', '10 tons', '10 RPM'],
        ],
      }],
    });
    const spec4 = JSON.stringify({
      tables: [{
        title: 'Tractor Specifications',
        columns: ['Model', 'Horsepower', 'Weight', 'Fuel Capacity'],
        rows: [
          ['TR-500', '500 HP', '8 tons', '200L'],
          ['TR-400', '400 HP', '6 tons', '150L'],
        ],
      }],
    });
    const spec5 = JSON.stringify({
      tables: [{
        title: 'Generator Specifications',
        columns: ['Power Output', 'Fuel Type', 'Weight', 'Dimensions'],
        rows: [
          ['1000 kW', 'Diesel', '5 tons', '4x2x2m'],
          ['500 kW', 'Diesel', '3 tons', '3x1.5x1.5m'],
        ],
      }],
    });

    await prisma.$queryRaw`
      INSERT INTO products (name, nameAr, category_id, category, status, views, description, descriptionAr, image, gallery, specifications_table, created_at, updated_at)
      VALUES 
      ('Heavy Duty Excavator', 'حفار ثقيل', ${miningCategory.id}, 'Mining', 'active', 250, 'High-performance excavator for mining operations with advanced hydraulic system', 'حفار عالي الأداء لعمليات التعدين مع نظام هيدروليكي متقدم', NULL, NULL, ${spec1}, NOW(), NOW()),
      ('Industrial Conveyor Belt', 'سير ناقل صناعي', ${industrialCategory.id}, 'Industrial', 'active', 320, 'Durable conveyor belt system for industrial applications with variable speed control', 'نظام سير ناقل متين للتطبيقات الصناعية مع تحكم في السرعة', NULL, NULL, ${spec2}, NOW(), NOW()),
      ('Cement Mixer Truck', 'شاحنة خلاطة أسمنت', ${constructionCategory.id}, 'Construction', 'active', 180, 'Professional cement mixer for construction sites with automatic mixing', 'خلاطة أسمنت احترافية لمواقع البناء مع خلط تلقائي', NULL, NULL, ${spec3}, NOW(), NOW()),
      ('Agricultural Tractor', 'جرار زراعي', ${agriculturalCategory.id}, 'Agricultural', 'active', 150, 'Powerful tractor for agricultural operations with advanced GPS navigation', 'جرار قوي للعمليات الزراعية مع نظام GPS متقدم', NULL, NULL, ${spec4}, NOW(), NOW()),
      ('Industrial Generator', 'مولد صناعي', ${energyCategory.id}, 'Energy', 'active', 200, 'High-capacity generator for industrial power supply with automatic backup', 'مولد عالي السعة لإمداد الطاقة الصناعية مع نسخ احتياطي تلقائي', NULL, NULL, ${spec5}, NOW(), NOW())
    `;
    console.log('✅ Products created\n');

    // ==================== CREATE NEWS ====================
    console.log('📰 Creating news articles...');
    await prisma.news.createMany({
      data: [
        {
          title: 'New Product Launch - Heavy Duty Excavator',
          titleAr: 'إطلاق منتج جديد - حفار ثقيل',
          date: new Date('2024-12-01'),
          category: 'Company News',
          views: 150,
          status: 'published',
          content: 'We are excited to announce the launch of our new Heavy Duty Excavator line. This state-of-the-art equipment features advanced hydraulic systems and improved fuel efficiency.',
          contentAr: 'نحن متحمسون للإعلان عن إطلاق خط حفارنا الثقيل الجديد. تتميز هذه المعدات المتطورة بأنظمة هيدروليكية متقدمة وكفاءة وقود محسنة.',
          image: null,
        },
        {
          title: 'Industry Conference 2024 - Success Story',
          titleAr: 'مؤتمر الصناعة 2024 - قصة نجاح',
          date: new Date('2024-11-15'),
          category: 'Events',
          views: 220,
          status: 'published',
          content: 'Join us at the annual industry conference where we showcased our latest innovations and connected with industry leaders from around the world.',
          contentAr: 'انضم إلينا في مؤتمر الصناعة السنوي حيث عرضنا أحدث ابتكاراتنا وتواصلنا مع قادة الصناعة من جميع أنحاء العالم.',
          image: null,
        },
        {
          title: 'Partnership Announcement with Global Mining Co.',
          titleAr: 'إعلان شراكة مع شركة التعدين العالمية',
          date: new Date('2024-10-20'),
          category: 'Partnerships',
          views: 180,
          status: 'published',
          content: 'We are proud to announce our strategic partnership with Global Mining Co. to expand our operations and serve more customers worldwide.',
          contentAr: 'نفخر بالإعلان عن شراكتنا الاستراتيجية مع شركة التعدين العالمية لتوسيع عملياتنا وخدمة المزيد من العملاء في جميع أنحاء العالم.',
          image: null,
        },
        {
          title: 'Sustainability Initiative Launch',
          titleAr: 'إطلاق مبادرة الاستدامة',
          date: new Date('2024-09-10'),
          category: 'Sustainability',
          views: 95,
          status: 'published',
          content: 'Our new sustainability initiative focuses on reducing carbon emissions and promoting eco-friendly manufacturing processes.',
          contentAr: 'تركز مبادرة الاستدامة الجديدة على تقليل انبعاثات الكربون وتعزيز عمليات التصنيع الصديقة للبيئة.',
          image: null,
        },
      ],
    });
    console.log('✅ News articles created\n');

    // ==================== CREATE BANNERS ====================
    console.log('🎨 Creating banners...');
    await prisma.$queryRaw`
      INSERT INTO banners (image, title, titleAr, subtitle, subtitleAr, description, descriptionAr, \`order\`, active, created_at, updated_at)
      VALUES 
      (NULL, 'Welcome to SMC', 'مرحباً بكم في SMC', 'Your Trusted Partner', 'شريكك الموثوق', 'Leading provider of industrial and mining solutions with over 20 years of experience', 'المزود الرائد للحلول الصناعية والتعدينية مع أكثر من 20 عاماً من الخبرة', 1, true, NOW(), NOW()),
      (NULL, 'Quality Products', 'منتجات عالية الجودة', 'Built to Last', 'مصممة لتدوم', 'Premium quality products for your business needs with international standards', 'منتجات عالية الجودة لاحتياجات عملك مع معايير دولية', 2, true, NOW(), NOW()),
      (NULL, 'Innovation & Excellence', 'الابتكار والتميز', 'Technology First', 'التكنولوجيا أولاً', 'Cutting-edge technology and innovative solutions for modern industries', 'تكنولوجيا متطورة وحلول مبتكرة للصناعات الحديثة', 3, true, NOW(), NOW())
    `;
    console.log('✅ Banners created\n');

    // ==================== CREATE MEMBERS ====================
    console.log('👥 Creating board members...');
    await prisma.$queryRaw`
      INSERT INTO members (name, nameAr, title, titleAr, \`order\`, status, created_at, updated_at)
      VALUES 
      ('John Doe', 'جون دو', 'CEO', 'الرئيس التنفيذي', 1, 'active', NOW(), NOW()),
      ('Jane Smith', 'جين سميث', 'CTO', 'رئيس التكنولوجيا', 2, 'active', NOW(), NOW()),
      ('Ahmed Ali', 'أحمد علي', 'CFO', 'المدير المالي', 3, 'active', NOW(), NOW()),
      ('Sarah Johnson', 'سارة جونسون', 'COO', 'مدير العمليات', 4, 'active', NOW(), NOW()),
      ('Mohammed Hassan', 'محمد حسن', 'VP Sales', 'نائب رئيس المبيعات', 5, 'active', NOW(), NOW())
    `;
    console.log('✅ Board members created\n');

    // ==================== CREATE CLIENTS ====================
    console.log('🏢 Creating clients...');
    await prisma.$queryRaw`
      INSERT INTO clients (name, nameAr, logo, website, \`order\`, status, created_at, updated_at)
      VALUES 
      ('ABC Corporation', 'شركة ABC', NULL, 'https://abc.com', 1, 'active', NOW(), NOW()),
      ('XYZ Industries', 'صناعات XYZ', NULL, 'https://xyz.com', 2, 'active', NOW(), NOW()),
      ('Global Mining Co.', 'شركة التعدين العالمية', NULL, 'https://globalmining.com', 3, 'active', NOW(), NOW()),
      ('Industrial Solutions Ltd.', 'حلول صناعية المحدودة', NULL, 'https://industrialsolutions.com', 4, 'active', NOW(), NOW()),
      ('Construction Partners Inc.', 'شركاء البناء', NULL, 'https://constructionpartners.com', 5, 'active', NOW(), NOW()),
      ('Energy Systems Group', 'مجموعة أنظمة الطاقة', NULL, 'https://energysystems.com', 6, 'active', NOW(), NOW())
    `;
    console.log('✅ Clients created\n');

    // ==================== CREATE TENDERS ====================
    console.log('📋 Creating tenders...');
    const tenders = await prisma.tender.createMany({
      data: [
        {
          title: 'Mining Equipment Supply Tender',
          titleAr: 'مناقصة توريد معدات التعدين',
          category: 'Mining',
          deadline: new Date('2025-01-31'),
          description: 'Supply of heavy-duty mining equipment including excavators, loaders, and drilling machines.',
          descriptionAr: 'توريد معدات التعدين الثقيلة بما في ذلك الحفارات واللوادر وآلات الحفر.',
          status: 'active',
          documentFile: null,
          documentFileName: null,
        },
        {
          title: 'Industrial Conveyor System Installation',
          titleAr: 'تركيب نظام الناقل الصناعي',
          category: 'Industrial',
          deadline: new Date('2025-02-15'),
          description: 'Installation and commissioning of industrial conveyor belt systems for manufacturing facilities.',
          descriptionAr: 'تركيب وتشغيل أنظمة السيور الناقلة الصناعية للمنشآت التصنيعية.',
          status: 'active',
          documentFile: null,
          documentFileName: null,
        },
        {
          title: 'Construction Machinery Rental',
          titleAr: 'إيجار معدات البناء',
          category: 'Construction',
          deadline: new Date('2025-03-01'),
          description: 'Long-term rental of construction machinery including cranes, mixers, and excavators.',
          descriptionAr: 'إيجار طويل الأجل لمعدات البناء بما في ذلك الرافعات والخلاطات والحفارات.',
          status: 'active',
          documentFile: null,
          documentFileName: null,
        },
      ],
    });
    const createdTenders = await prisma.tender.findMany();
    console.log('✅ Tenders created\n');

    // ==================== CREATE TENDER SUBMISSIONS ====================
    console.log('📝 Creating tender submissions...');
    if (createdTenders.length > 0) {
      await prisma.tenderSubmission.createMany({
        data: [
          {
            tenderId: createdTenders[0].id,
            companyName: 'Mining Solutions Inc.',
            contactName: 'Robert Brown',
            email: 'robert@miningsolutions.com',
            phone: '+1-555-0101',
            files: null,
            status: 'pending',
          },
          {
            tenderId: createdTenders[0].id,
            companyName: 'Heavy Equipment Co.',
            contactName: 'Lisa White',
            email: 'lisa@heavyeq.com',
            phone: '+1-555-0102',
            files: null,
            status: 'under_review',
          },
          {
            tenderId: createdTenders[1].id,
            companyName: 'Industrial Systems Ltd.',
            contactName: 'David Green',
            email: 'david@industrialsys.com',
            phone: '+1-555-0103',
            files: null,
            status: 'pending',
          },
        ],
      });
    }
    console.log('✅ Tender submissions created\n');

    // ==================== CREATE CONTACTS ====================
    console.log('📧 Creating contact messages...');
    await prisma.contact.createMany({
      data: [
        {
          name: 'John Customer',
          email: 'john.customer@email.com',
          phone: '+1-555-1001',
          message: 'I am interested in your mining equipment. Can you provide more information?',
          status: 'new',
          date: new Date(),
        },
        {
          name: 'Maria Garcia',
          email: 'maria.garcia@email.com',
          phone: '+1-555-1002',
          message: 'Looking for industrial conveyor systems for our new facility.',
          status: 'read',
          date: new Date('2024-11-20'),
        },
        {
          name: 'Ahmed Ibrahim',
          email: 'ahmed.ibrahim@email.com',
          phone: '+20-100-1234567',
          message: 'Need quotation for construction machinery rental.',
          status: 'new',
          date: new Date(),
        },
        {
          name: 'Sarah Wilson',
          email: 'sarah.wilson@email.com',
          phone: '+1-555-1004',
          message: 'Interested in partnership opportunities.',
          status: 'read',
          date: new Date('2024-11-15'),
        },
      ],
    });
    console.log('✅ Contact messages created\n');

    // ==================== CREATE COMPLAINTS ====================
    console.log('⚠️  Creating complaints...');
    await prisma.complaint.createMany({
      data: [
        {
          name: 'Customer Service Issue',
          email: 'customer@email.com',
          subject: 'Delivery Delay',
          message: 'My order was delayed by two weeks. Please investigate.',
          status: 'pending',
          date: new Date(),
        },
        {
          name: 'Quality Concern',
          email: 'quality@email.com',
          subject: 'Product Quality',
          message: 'Received product with minor defects. Need replacement.',
          status: 'in-progress',
          date: new Date('2024-11-25'),
        },
        {
          name: 'Billing Issue',
          email: 'billing@email.com',
          subject: 'Invoice Error',
          message: 'Incorrect amount charged on invoice #12345.',
          status: 'resolved',
          date: new Date('2024-11-10'),
        },
      ],
    });
    console.log('✅ Complaints created\n');

    // ==================== CREATE CHAT MESSAGES ====================
    console.log('💬 Creating chat messages...');
    await prisma.chatMessage.createMany({
      data: [
        {
          name: 'Online Customer',
          email: 'customer1@email.com',
          message: 'Hello, I need help with product selection.',
          reply: 'Hello! I would be happy to help you choose the right product. What are your requirements?',
          status: 'replied',
          timestamp: new Date(),
        },
        {
          name: 'Inquiry User',
          email: 'inquiry@email.com',
          message: 'What is the warranty period for your products?',
          reply: null,
          status: 'pending',
          timestamp: new Date(),
        },
        {
          name: 'Support Request',
          email: 'support@email.com',
          message: 'Need technical support for equipment installation.',
          reply: 'Our technical team will contact you within 24 hours.',
          status: 'replied',
          timestamp: new Date('2024-11-28'),
        },
      ],
    });
    console.log('✅ Chat messages created\n');

    // ==================== CREATE FINANCIAL DATA ====================
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
        { month: 'May', production: 6200, target: 6000 },
        { month: 'June', production: 6100, target: 6000 },
        { month: 'July', production: 5900, target: 6000 },
        { month: 'August', production: 6300, target: 6000 },
        { month: 'September', production: 6000, target: 6000 },
        { month: 'October', production: 5800, target: 6000 },
        { month: 'November', production: 6200, target: 6000 },
        { month: 'December', production: 6100, target: 6000 },
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

    // ==================== CREATE SITE SETTINGS ====================
    console.log('⚙️  Creating site settings...');
    await prisma.siteSetting.createMany({
      data: [
        { key: 'company_name', valueEn: 'SMC Digital Suite', valueAr: 'SMC الحلول الرقمية' },
        { key: 'company_email', valueEn: 'info@smc.com', valueAr: 'info@smc.com' },
        { key: 'company_phone', valueEn: '+1-234-567-8900', valueAr: '+1-234-567-8900' },
        { key: 'company_address', valueEn: '123 Main Street, City, Country', valueAr: '123 الشارع الرئيسي، المدينة، البلد' },
        { key: 'company_website', valueEn: 'https://www.smc.com', valueAr: 'https://www.smc.com' },
        { key: 'facebook_url', valueEn: 'https://facebook.com/smc', valueAr: 'https://facebook.com/smc' },
        { key: 'twitter_url', valueEn: 'https://twitter.com/smc', valueAr: 'https://twitter.com/smc' },
        { key: 'linkedin_url', valueEn: 'https://linkedin.com/company/smc', valueAr: 'https://linkedin.com/company/smc' },
      ],
    });
    console.log('✅ Site settings created\n');

    // ==================== CREATE PAGE CONTENT ====================
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
          valueEn: 'We are a leading provider of industrial and mining solutions with over 20 years of experience in the industry.',
          valueAr: 'نحن مزود رائد للحلول الصناعية والتعدينية مع أكثر من 20 عاماً من الخبرة في الصناعة.',
        },
        {
          page: 'about',
          key: 'mission',
          valueEn: 'Our mission is to deliver high-quality products and services that exceed customer expectations.',
          valueAr: 'مهمتنا هي تقديم منتجات وخدمات عالية الجودة تتجاوز توقعات العملاء.',
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
          valueEn: 'Get in touch with our team. We are here to help you with all your needs.',
          valueAr: 'تواصل مع فريقنا. نحن هنا لمساعدتك في جميع احتياجاتك.',
        },
        {
          page: 'home',
          key: 'welcome_title',
          valueEn: 'Welcome to SMC',
          valueAr: 'مرحباً بكم في SMC',
        },
        {
          page: 'home',
          key: 'welcome_message',
          valueEn: 'Your trusted partner for industrial and mining solutions.',
          valueAr: 'شريكك الموثوق للحلول الصناعية والتعدينية.',
        },
      ],
    });
    console.log('✅ Page content created\n');

    // ==================== SUMMARY ====================
    console.log('✅ Database seed completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - ${await prisma.user.count()} users`);
    console.log(`   - ${await prisma.productCategory.count()} categories`);
    console.log(`   - ${await prisma.product.count()} products`);
    console.log(`   - ${await prisma.news.count()} news articles`);
    console.log(`   - ${await prisma.banner.count()} banners`);
    console.log(`   - ${await prisma.member.count()} board members`);
    console.log(`   - ${await prisma.client.count()} clients`);
    console.log(`   - ${await prisma.tender.count()} tenders`);
    console.log(`   - ${await prisma.tenderSubmission.count()} tender submissions`);
    console.log(`   - ${await prisma.contact.count()} contact messages`);
    console.log(`   - ${await prisma.complaint.count()} complaints`);
    console.log(`   - ${await prisma.chatMessage.count()} chat messages`);
    console.log(`   - ${await prisma.financialRevenue.count()} revenue records`);
    console.log(`   - ${await prisma.financialProduction.count()} production records`);
    console.log(`   - ${await prisma.financialExport.count()} export records`);
    console.log(`   - ${await prisma.siteSetting.count()} site settings`);
    console.log(`   - ${await prisma.pageContent.count()} page content items\n`);
    
    console.log('🔐 ADMIN CREDENTIALS:');
    console.log('   Email: admin@smc.com');
    console.log('   Password: Admin@123');
    console.log('   Role: admin');
    console.log('   Status: active');
    console.log('   Permissions: read, write, delete, manage_users, manage_settings');
    console.log('   ⚠️  IMPORTANT: Change this password after first login!\n');
    console.log('📧 OTHER USER CREDENTIALS:');
    console.log('   Editor: editor@smc.com / Editor@123');
    console.log('   Viewer: viewer@smc.com / Viewer@123');
    console.log('   Manager: manager@smc.com / Manager@123\n');
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
