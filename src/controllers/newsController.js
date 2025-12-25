// News Controller
import prisma from '../config/database.js';
import { deleteFileByUrl } from '../utils/upload.js';

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
    // Extract only the fields that belong to the News model
    const { title, titleAr, date, category, views, status, content, contentAr } = req.body;
    
    // Determine image value
    let image = null;
    if (req.file) {
      // Use uploadedFileUrl if available, otherwise construct it
      if (req.uploadedFileUrl) {
        image = req.uploadedFileUrl;
      } else {
        // Fallback: construct the path manually
        const folderName = 'news'; // News images go to news folder
        const filename = req.file.filename;
        image = `/uploads/${folderName}/${filename}`;
      }
    } else if (req.body.image && req.body.image.startsWith("data:image")) {
      // If base64 image is provided, keep it (backward compatibility)
      image = req.body.image;
    }

    // Build data object with only valid Prisma fields
    const data = {
      title: title || null,
      titleAr: titleAr || null,
      date: date ? new Date(date) : new Date(),
      category: category || null,
      views: views !== undefined && views !== null ? parseInt(String(views), 10) : 0,
      status: status || 'published',
      content: content || null,
      contentAr: contentAr || null,
      image: image,
    };
    
    const newNews = await prisma.news.create({ data });
    res.json(newNews);
  } catch (error) {
    // If file was uploaded but database save failed, delete the file
    if (req.file && req.uploadedFilePath) {
      deleteFileByUrl(req.uploadedFileUrl);
    }
    next(error);
  }
};

export const updateNews = async (req, res, next) => {
  try {
    const newsId = parseInt(req.params.id);
    
    // Get existing news to check for old image
    const existingNews = await prisma.news.findUnique({
      where: { id: newsId }
    });
    
    if (!existingNews) {
      return res.status(404).json({ error: 'News not found' });
    }
    
    // Extract only the fields that belong to the News model
    const { title, titleAr, date, category, views, status, content, contentAr } = req.body;
    
    // Determine image value
    let image = existingNews.image; // Keep existing image by default
    
    if (req.file) {
      // Delete old image file if it exists and is a file path (not base64)
      if (existingNews.image && existingNews.image.startsWith('/uploads/')) {
        deleteFileByUrl(existingNews.image);
      }
      // Use uploadedFileUrl if available, otherwise construct it
      if (req.uploadedFileUrl) {
        image = req.uploadedFileUrl;
      } else {
        // Fallback: construct the path manually
        const folderName = 'news'; // News images go to news folder
        const filename = req.file.filename;
        image = `/uploads/${folderName}/${filename}`;
      }
    } else if (req.body.image && req.body.image.startsWith("data:image")) {
      // If base64 image is provided, keep it (backward compatibility)
      image = req.body.image;
    } else if (req.body.image === null || req.body.image === "") {
      // If image is being removed
      if (existingNews.image && existingNews.image.startsWith('/uploads/')) {
        deleteFileByUrl(existingNews.image);
      }
      image = null;
    }

    // Build data object with only valid Prisma fields
    const data = {};
    
    // Only include fields that are provided and valid
    if (title !== undefined) data.title = title || null;
    if (titleAr !== undefined) data.titleAr = titleAr || null;
    if (date !== undefined) data.date = date ? new Date(date) : existingNews.date;
    if (category !== undefined) data.category = category || null;
    if (views !== undefined) data.views = views !== null && views !== '' ? parseInt(String(views), 10) : existingNews.views;
    if (status !== undefined) data.status = status || 'published';
    if (content !== undefined) data.content = content || null;
    if (contentAr !== undefined) data.contentAr = contentAr || null;
    if (image !== undefined) data.image = image;
    
    const updatedNews = await prisma.news.update({
      where: { id: newsId },
      data,
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
    // Get news first to delete associated image file
    const news = await prisma.news.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    
    if (!news) {
      return res.status(404).json({ error: 'News not found' });
    }
    
    // Delete image file if it exists and is a file path (not base64)
    if (news.image && news.image.startsWith('/uploads/')) {
      deleteFileByUrl(news.image);
    }
    
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

