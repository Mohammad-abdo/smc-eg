#!/usr/bin/env node
// Patch to remove all raw SQL queries and replace with Prisma
// This script updates server.js to use Prisma exclusively

const fs = require('fs');
const path = require('path');

const serverPath = path.join(__dirname, '../server.js');
let content = fs.readFileSync(serverPath, 'utf8');

console.log('🔧 Removing raw SQL queries and replacing with Prisma...\n');

// 1. Remove CREATE TABLE code
content = content.replace(
  /\/\/ Ensure clients table exists[\s\S]*?}\)\);[\s\n]*/g,
  '// Clients table is managed by Prisma migrations\n'
);

// 2. Replace Contacts endpoints
content = content.replace(
  /app\.get\('\/api\/contacts', async \(req, res\) => \{[\s\S]*?const contacts = await query\([^;]+\);[\s\S]*?\}\);[\s\n]*/g,
  `app.get('/api/contacts', async (req, res) => {
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

`
);

content = content.replace(
  /app\.post\('\/api\/contacts', async \(req, res\) => \{[\s\S]*?const result = await query\([^;]+\);[\s\S]*?const newContact = await queryOne\([^;]+\);[\s\S]*?\}\);[\s\n]*/g,
  `app.post('/api/contacts', async (req, res) => {
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

`
);

content = content.replace(
  /app\.put\('\/api\/contacts\/:id', async \(req, res\) => \{[\s\S]*?await query\([^;]+\);[\s\S]*?const updatedContact = await queryOne\([^;]+\);[\s\S]*?\}\);[\s\n]*/g,
  `app.put('/api/contacts/:id', async (req, res) => {
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

`
);

// 3. Replace Complaints endpoints
content = content.replace(
  /app\.get\('\/api\/complaints', async \(req, res\) => \{[\s\S]*?const complaints = await query\([^;]+\);[\s\S]*?\}\);[\s\n]*/g,
  `app.get('/api/complaints', async (req, res) => {
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

`
);

content = content.replace(
  /app\.post\('\/api\/complaints', async \(req, res\) => \{[\s\S]*?const result = await query\([^;]+\);[\s\S]*?const newComplaint = await queryOne\([^;]+\);[\s\S]*?\}\);[\s\n]*/g,
  `app.post('/api/complaints', async (req, res) => {
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

`
);

content = content.replace(
  /app\.put\('\/api\/complaints\/:id', async \(req, res\) => \{[\s\S]*?await query\([^;]+\);[\s\S]*?const updatedComplaint = await queryOne\([^;]+\);[\s\S]*?\}\);[\s\n]*/g,
  `app.put('/api/complaints/:id', async (req, res) => {
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

`
);

// 4. Replace Banners endpoints
content = content.replace(
  /app\.get\('\/api\/banners', async \(req, res\) => \{[\s\S]*?const banners = await query\([^;]+\);[\s\S]*?\}\);[\s\n]*/g,
  `app.get('/api/banners', async (req, res) => {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: [
        { order: 'asc' },
        { id: 'asc' },
      ],
    });
    res.json(banners);
  } catch (error) {
    console.error('Error fetching banners:', error);
    res.status(500).json({ error: error.message });
  }
});

`
);

content = content.replace(
  /app\.post\('\/api\/banners', async \(req, res\) => \{[\s\S]*?const result = await query\([^;]+\);[\s\S]*?const newBanner = await queryOne\([^;]+\);[\s\S]*?\}\);[\s\n]*/g,
  `app.post('/api/banners', async (req, res) => {
  try {
    const { image, title, titleAr, subtitle, subtitleAr, description, descriptionAr, order, active } = req.body;
    const newBanner = await prisma.banner.create({
      data: {
        image: image || null,
        title: title || null,
        titleAr: titleAr || null,
        subtitle: subtitle || null,
        subtitleAr: subtitleAr || null,
        description: description || null,
        descriptionAr: descriptionAr || null,
        order: order || 0,
        active: active !== undefined ? active : true,
      },
    });
    res.json(newBanner);
  } catch (error) {
    console.error('Error creating banner:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to create banner',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

`
);

content = content.replace(
  /app\.put\('\/api\/banners\/:id', async \(req, res\) => \{[\s\S]*?await query\([^;]+\);[\s\S]*?const updatedBanner = await queryOne\([^;]+\);[\s\S]*?\}\);[\s\n]*/g,
  `app.put('/api/banners/:id', async (req, res) => {
  try {
    const { image, title, titleAr, subtitle, subtitleAr, description, descriptionAr, order, active } = req.body;
    const updatedBanner = await prisma.banner.update({
      where: { id: parseInt(req.params.id) },
      data: {
        image: image || null,
        title: title || null,
        titleAr: titleAr || null,
        subtitle: subtitle || null,
        subtitleAr: subtitleAr || null,
        description: description || null,
        descriptionAr: descriptionAr || null,
        order: order || 0,
        active: active !== undefined ? active : true,
      },
    });
    res.json(updatedBanner);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Banner not found' });
    }
    console.error('Error updating banner:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to update banner',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

`
);

content = content.replace(
  /app\.delete\('\/api\/banners\/:id', async \(req, res\) => \{[\s\S]*?await query\([^;]+\);[\s\S]*?\}\);[\s\n]*/g,
  `app.delete('/api/banners/:id', async (req, res) => {
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

`
);

// Continue with other endpoints...
// (This is a simplified version - full patch will be applied directly to server.js)

fs.writeFileSync(serverPath, content, 'utf8');
console.log('✅ Patch applied!');

