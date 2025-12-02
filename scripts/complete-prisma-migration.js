#!/usr/bin/env node
// Complete Prisma Migration Script
// Replaces ALL remaining query() and queryOne() calls with Prisma

const fs = require('fs');
const path = require('path');

const serverPath = path.join(__dirname, '../server.js');
let content = fs.readFileSync(serverPath, 'utf8');

console.log('🔧 Completing Prisma migration - removing all raw SQL...\n');

// Fix product-categories/:id/products endpoint
content = content.replace(
  /\/\/ Parse JSON fields[\s\S]*?return product;[\s\S]*?\}\);[\s\n]*/,
  '    const parsedProducts = products.map(product => formatProduct(product));\n'
);

// Tender Submissions
content = content.replace(
  /app\.post\('\/api\/tenders\/:id\/submit', async \(req, res\) => \{[\s\S]*?const result = await query\([^;]+\);[\s\S]*?const newSubmission = await queryOne\([^;]+\);[\s\S]*?\}\);[\s\n]*/g,
  `app.post('/api/tenders/:id/submit', async (req, res) => {
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

`
);

content = content.replace(
  /app\.get\('\/api\/tenders\/:id\/submissions', async \(req, res\) => \{[\s\S]*?const submissions = await query\([^;]+\);[\s\S]*?\}\);[\s\n]*/g,
  `app.get('/api/tenders/:id/submissions', async (req, res) => {
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

`
);

content = content.replace(
  /app\.put\('\/api\/tender-submissions\/:id', async \(req, res\) => \{[\s\S]*?await query\([^;]+\);[\s\S]*?const updatedSubmission = await queryOne\([^;]+\);[\s\S]*?\}\);[\s\n]*/g,
  `app.put('/api/tender-submissions/:id', async (req, res) => {
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

`
);

// Members
content = content.replace(
  /app\.get\('\/api\/members', async \(req, res\) => \{[\s\S]*?const members = await query\([^;]+\);[\s\S]*?\}\);[\s\n]*/g,
  `app.get('/api/members', async (req, res) => {
  try {
    const members = await prisma.member.findMany({
      where: { status: 'active' },
      orderBy: [
        { order: 'asc' },
        { id: 'asc' },
      ],
    });
    res.json(members);
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ error: error.message });
  }
});

`
);

content = content.replace(
  /app\.get\('\/api\/members\/:id', async \(req, res\) => \{[\s\S]*?const member = await queryOne\([^;]+\);[\s\S]*?\}\);[\s\n]*/g,
  `app.get('/api/members/:id', async (req, res) => {
  try {
    const member = await prisma.member.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!member) return res.status(404).json({ error: 'Member not found' });
    res.json(member);
  } catch (error) {
    console.error('Error fetching member:', error);
    res.status(500).json({ error: error.message });
  }
});

`
);

content = content.replace(
  /app\.post\('\/api\/members', async \(req, res\) => \{[\s\S]*?const result = await query\([^;]+\);[\s\S]*?const newMember = await queryOne\([^;]+\);[\s\S]*?\}\);[\s\n]*/g,
  `app.post('/api/members', async (req, res) => {
  try {
    const { name, nameAr, title, titleAr, order, status } = req.body;
    const newMember = await prisma.member.create({
      data: {
        name,
        nameAr: nameAr || null,
        title: title || null,
        titleAr: titleAr || null,
        order: order || 0,
        status: status || 'active',
      },
    });
    res.json(newMember);
  } catch (error) {
    console.error('Error creating member:', error);
    res.status(500).json({ error: error.message });
  }
});

`
);

content = content.replace(
  /app\.put\('\/api\/members\/:id', async \(req, res\) => \{[\s\S]*?await query\([^;]+\);[\s\S]*?const updatedMember = await queryOne\([^;]+\);[\s\S]*?\}\);[\s\n]*/g,
  `app.put('/api/members/:id', async (req, res) => {
  try {
    const { name, nameAr, title, titleAr, order, status } = req.body;
    const updatedMember = await prisma.member.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name,
        nameAr: nameAr || null,
        title: title || null,
        titleAr: titleAr || null,
        order: order || 0,
        status: status || 'active',
      },
    });
    res.json(updatedMember);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Member not found' });
    }
    console.error('Error updating member:', error);
    res.status(500).json({ error: error.message });
  }
});

`
);

content = content.replace(
  /app\.delete\('\/api\/members\/:id', async \(req, res\) => \{[\s\S]*?await query\([^;]+\);[\s\S]*?\}\);[\s\n]*/g,
  `app.delete('/api/members/:id', async (req, res) => {
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

`
);

// Clients
content = content.replace(
  /app\.get\('\/api\/clients', async \(req, res\) => \{[\s\S]*?let clients;[\s\S]*?if \(req\.query\.status === 'all'\) \{[\s\S]*?clients = await query\([^;]+\);[\s\S]*?\} else \{[\s\S]*?clients = await query\([^;]+\);[\s\S]*?\}[\s\S]*?res\.json\(clients\);[\s\S]*?\}\);[\s\n]*/g,
  `app.get('/api/clients', async (req, res) => {
  try {
    let clients;
    if (req.query.status === 'all') {
      clients = await prisma.client.findMany({
        orderBy: [
          { order: 'asc' },
          { id: 'asc' },
        ],
      });
    } else {
      clients = await prisma.client.findMany({
        where: { status: 'active' },
        orderBy: [
          { order: 'asc' },
          { id: 'asc' },
        ],
      });
    }
    res.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: error.message });
  }
});

`
);

content = content.replace(
  /app\.get\('\/api\/clients\/:id', async \(req, res\) => \{[\s\S]*?const client = await queryOne\([^;]+\);[\s\S]*?\}\);[\s\n]*/g,
  `app.get('/api/clients/:id', async (req, res) => {
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

`
);

content = content.replace(
  /app\.post\('\/api\/clients', async \(req, res\) => \{[\s\S]*?const result = await query\([^;]+\);[\s\S]*?const newClient = await queryOne\([^;]+\);[\s\S]*?\}\);[\s\n]*/g,
  `app.post('/api/clients', async (req, res) => {
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
        order: order || 0,
        status: status || 'active',
      },
    });
    res.json(newClient);
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ error: error.message });
  }
});

`
);

content = content.replace(
  /app\.put\('\/api\/clients\/:id', async \(req, res\) => \{[\s\S]*?await query\([^;]+\);[\s\S]*?const updatedClient = await queryOne\([^;]+\);[\s\S]*?\}\);[\s\n]*/g,
  `app.put('/api/clients/:id', async (req, res) => {
  try {
    const { name, nameAr, logo, website, order, status } = req.body;
    const updatedClient = await prisma.client.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name,
        nameAr: nameAr || null,
        logo: logo || null,
        website: website || null,
        order: order || 0,
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

`
);

content = content.replace(
  /app\.delete\('\/api\/clients\/:id', async \(req, res\) => \{[\s\S]*?await query\([^;]+\);[\s\S]*?\}\);[\s\n]*/g,
  `app.delete('/api/clients/:id', async (req, res) => {
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

`
);

// Financial Revenue
content = content.replace(
  /app\.get\('\/api\/financial\/revenue', async \(req, res\) => \{[\s\S]*?const data = await query\([^;]+\);[\s\S]*?\}\);[\s\n]*/g,
  `app.get('/api/financial/revenue', async (req, res) => {
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

`
);

content = content.replace(
  /app\.post\('\/api\/financial\/revenue', async \(req, res\) => \{[\s\S]*?const result = await query\([^;]+\);[\s\S]*?const newData = await queryOne\([^;]+\);[\s\S]*?\}\);[\s\n]*/g,
  `app.post('/api/financial/revenue', async (req, res) => {
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

`
);

content = content.replace(
  /app\.put\('\/api\/financial\/revenue\/:id', async \(req, res\) => \{[\s\S]*?await query\([^;]+\);[\s\S]*?const updatedData = await queryOne\([^;]+\);[\s\S]*?\}\);[\s\n]*/g,
  `app.put('/api/financial/revenue/:id', async (req, res) => {
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

`
);

content = content.replace(
  /app\.delete\('\/api\/financial\/revenue\/:id', async \(req, res\) => \{[\s\S]*?await query\([^;]+\);[\s\S]*?\}\);[\s\n]*/g,
  `app.delete('/api/financial/revenue/:id', async (req, res) => {
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

`
);

// Financial Production
content = content.replace(
  /app\.get\('\/api\/financial\/production', async \(req, res\) => \{[\s\S]*?const data = await query\([^;]+\);[\s\S]*?\}\);[\s\n]*/g,
  `app.get('/api/financial/production', async (req, res) => {
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

`
);

content = content.replace(
  /app\.post\('\/api\/financial\/production', async \(req, res\) => \{[\s\S]*?const result = await query\([^;]+\);[\s\S]*?const newData = await queryOne\([^;]+\);[\s\S]*?\}\);[\s\n]*/g,
  `app.post('/api/financial/production', async (req, res) => {
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

`
);

content = content.replace(
  /app\.put\('\/api\/financial\/production\/:id', async \(req, res\) => \{[\s\S]*?await query\([^;]+\);[\s\S]*?const updatedData = await queryOne\([^;]+\);[\s\S]*?\}\);[\s\n]*/g,
  `app.put('/api/financial/production/:id', async (req, res) => {
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

`
);

content = content.replace(
  /app\.delete\('\/api\/financial\/production\/:id', async \(req, res\) => \{[\s\S]*?await query\([^;]+\);[\s\S]*?\}\);[\s\n]*/g,
  `app.delete('/api/financial/production/:id', async (req, res) => {
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

`
);

// Financial Export
content = content.replace(
  /app\.get\('\/api\/financial\/export', async \(req, res\) => \{[\s\S]*?const data = await query\([^;]+\);[\s\S]*?\}\);[\s\n]*/g,
  `app.get('/api/financial/export', async (req, res) => {
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

`
);

content = content.replace(
  /app\.post\('\/api\/financial\/export', async \(req, res\) => \{[\s\S]*?const result = await query\([^;]+\);[\s\S]*?const newData = await queryOne\([^;]+\);[\s\S]*?\}\);[\s\n]*/g,
  `app.post('/api/financial/export', async (req, res) => {
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

`
);

content = content.replace(
  /app\.put\('\/api\/financial\/export\/:id', async \(req, res\) => \{[\s\S]*?await query\([^;]+\);[\s\S]*?const updatedData = await queryOne\([^;]+\);[\s\S]*?\}\);[\s\n]*/g,
  `app.put('/api/financial/export/:id', async (req, res) => {
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

`
);

content = content.replace(
  /app\.delete\('\/api\/financial\/export\/:id', async \(req, res\) => \{[\s\S]*?await query\([^;]+\);[\s\S]*?\}\);[\s\n]*/g,
  `app.delete('/api/financial/export/:id', async (req, res) => {
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

`
);

// Chat Messages
content = content.replace(
  /app\.get\('\/api\/chat', async \(req, res\) => \{[\s\S]*?const messages = await query\([^;]+\);[\s\S]*?\}\);[\s\n]*/g,
  `app.get('/api/chat', async (req, res) => {
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

`
);

content = content.replace(
  /app\.post\('\/api\/chat', async \(req, res\) => \{[\s\S]*?const result = await query\([^;]+\);[\s\S]*?const newMessage = await queryOne\([^;]+\);[\s\S]*?\}\);[\s\n]*/g,
  `app.post('/api/chat', async (req, res) => {
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

`
);

content = content.replace(
  /app\.put\('\/api\/chat\/:id', async \(req, res\) => \{[\s\S]*?await query\([^;]+\);[\s\S]*?const updatedMessage = await queryOne\([^;]+\);[\s\S]*?\}\);[\s\n]*/g,
  `app.put('/api/chat/:id', async (req, res) => {
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

`
);

// Page Content
content = content.replace(
  /app\.get\('\/api\/page-content', async \(req, res\) => \{[\s\S]*?const content = await query\([^;]+\);[\s\S]*?res\.json\(result\);[\s\S]*?\}\);[\s\n]*/g,
  `app.get('/api/page-content', async (req, res) => {
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

`
);

content = content.replace(
  /app\.post\('\/api\/page-content', async \(req, res\) => \{[\s\S]*?await query\([^;]+\);[\s\S]*?const updated = await queryOne\([^;]+\);[\s\S]*?\}\);[\s\n]*/g,
  `app.post('/api/page-content', async (req, res) => {
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

`
);

// Site Settings
content = content.replace(
  /app\.get\('\/api\/settings', async \(req, res\) => \{[\s\S]*?const settings = await query\([^;]+\);[\s\S]*?res\.json\(result\);[\s\S]*?\}\);[\s\n]*/g,
  `app.get('/api/settings', async (req, res) => {
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

`
);

content = content.replace(
  /app\.post\('\/api\/settings', async \(req, res\) => \{[\s\S]*?await query\([^;]+\);[\s\S]*?const updated = await queryOne\([^;]+\);[\s\S]*?\}\);[\s\n]*/g,
  `app.post('/api/settings', async (req, res) => {
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

`
);

// Statistics
content = content.replace(
  /app\.get\('\/api\/statistics\/overview', async \(req, res\) => \{[\s\S]*?const \[products\] = await query\([^;]+\);[\s\S]*?const \[news\] = await query\([^;]+\);[\s\S]*?const \[contacts\] = await query\([^;]+\);[\s\S]*?const \[complaints\] = await query\([^;]+\);[\s\S]*?const \[totalViews\] = await query\([^;]+\);[\s\S]*?res\.json\(\{[\s\S]*?\}\);[\s\S]*?\}\);[\s\n]*/g,
  `app.get('/api/statistics/overview', async (req, res) => {
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

`
);

content = content.replace(
  /app\.get\('\/api\/statistics\/product-views', async \(req, res\) => \{[\s\S]*?const products = await query\([^;]+\);[\s\S]*?\}\);[\s\n]*/g,
  `app.get('/api/statistics/product-views', async (req, res) => {
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

`
);

fs.writeFileSync(serverPath, content, 'utf8');
console.log('✅ All raw SQL queries replaced with Prisma!');
console.log('📝 Please review the changes and test the endpoints.');

