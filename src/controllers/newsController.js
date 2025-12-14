// News Controller
import prisma from '../config/database.js';

export const getAllNews = async (req, res, next) => {
  try {
    const news = await prisma.news.findMany({
      orderBy: [
        { date: 'desc' },
        { id: 'desc' },
      ],
    });
    res.json(news);
  } catch (error) {
    next(error);
  }
};

export const getNewsById = async (req, res, next) => {
  try {
    const item = await prisma.news.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!item) {
      return res.status(404).json({ error: 'News not found' });
    }
    res.json(item);
  } catch (error) {
    next(error);
  }
};

export const createNews = async (req, res, next) => {
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
    next(error);
  }
};

export const updateNews = async (req, res, next) => {
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
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'News not found' });
    }
    next(error);
  }
};

export const deleteNews = async (req, res, next) => {
  try {
    await prisma.news.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ success: true });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'News not found' });
    }
    next(error);
  }
};

