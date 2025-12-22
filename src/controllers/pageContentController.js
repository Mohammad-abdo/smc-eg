// Page Content Controller
import prisma from '../config/database.js';

export const getAllPageContent = async (req, res, next) => {
  try {
    const { page } = req.query;
    const where = page ? { page } : {};
    
    const content = await prisma.pageContent.findMany({
      where,
      orderBy: [
        { page: 'asc' },
        { key: 'asc' },
      ],
    });
    res.json(content);
  } catch (error) {
    next(error);
  }
};

export const getPageContentByPage = async (req, res, next) => {
  try {
    const { page } = req.params;
    const content = await prisma.pageContent.findMany({
      where: { page },
      orderBy: { key: 'asc' },
    });
    res.json(content);
  } catch (error) {
    next(error);
  }
};

export const getPageContentByKey = async (req, res, next) => {
  try {
    const { page, key } = req.params;
    const content = await prisma.pageContent.findFirst({
      where: {
        page,
        key,
      },
    });
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }
    res.json(content);
  } catch (error) {
    next(error);
  }
};

export const createOrUpdatePageContent = async (req, res, next) => {
  try {
    const { page, key, valueEn, valueAr } = req.body;
    
    if (!page || !key) {
      return res.status(400).json({ error: 'Page and key are required' });
    }

    // Check if exists
    const existing = await prisma.pageContent.findFirst({
      where: { page, key },
    });

    let content;
    if (existing) {
      content = await prisma.pageContent.update({
        where: { id: existing.id },
        data: {
          valueEn: valueEn !== undefined ? valueEn : null,
          valueAr: valueAr !== undefined ? valueAr : null,
        },
      });
    } else {
      content = await prisma.pageContent.create({
        data: {
          page,
          key,
          valueEn: valueEn !== undefined ? valueEn : null,
          valueAr: valueAr !== undefined ? valueAr : null,
        },
      });
    }
    res.json(content);
  } catch (error) {
    next(error);
  }
};

export const deletePageContent = async (req, res, next) => {
  try {
    const { page, key } = req.params;
    const content = await prisma.pageContent.findFirst({
      where: { page, key },
    });
    
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }
    
    await prisma.pageContent.delete({
      where: { id: content.id },
    });
    res.json({ message: 'Content deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const bulkUpdatePageContent = async (req, res, next) => {
  try {
    const { content } = req.body; // Array of { page, key, valueEn, valueAr }
    
    if (!Array.isArray(content)) {
      return res.status(400).json({ error: 'Content must be an array' });
    }

    const results = await Promise.all(
      content.map(async ({ page, key, valueEn, valueAr }) => {
        const existing = await prisma.pageContent.findFirst({
          where: { page, key },
        });
        
        if (existing) {
          return prisma.pageContent.update({
            where: { id: existing.id },
            data: {
              valueEn: valueEn !== undefined ? valueEn : null,
              valueAr: valueAr !== undefined ? valueAr : null,
            },
          });
        } else {
          return prisma.pageContent.create({
            data: {
              page,
              key,
              valueEn: valueEn !== undefined ? valueEn : null,
              valueAr: valueAr !== undefined ? valueAr : null,
            },
          });
        }
      })
    );

    res.json({ message: 'Content updated successfully', count: results.length, results });
  } catch (error) {
    next(error);
  }
};

