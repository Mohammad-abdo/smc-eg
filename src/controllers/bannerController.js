// Banners Controller
import prisma from '../config/database.js';

export const getAllBanners = async (req, res, next) => {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: [{ order: 'asc' }, { id: 'asc' }],
    });
    res.json(banners);
  } catch (error) {
    next(error);
  }
};

export const getBannerById = async (req, res, next) => {
  try {
    const banner = await prisma.banner.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!banner) {
      return res.status(404).json({ error: 'Banner not found' });
    }
    res.json(banner);
  } catch (error) {
    next(error);
  }
};

export const createBanner = async (req, res, next) => {
  try {
    const banner = await prisma.banner.create({ data: req.body });
    res.json(banner);
  } catch (error) {
    next(error);
  }
};

export const updateBanner = async (req, res, next) => {
  try {
    const banner = await prisma.banner.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });
    res.json(banner);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Banner not found' });
    }
    next(error);
  }
};

export const deleteBanner = async (req, res, next) => {
  try {
    await prisma.banner.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ success: true });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Banner not found' });
    }
    next(error);
  }
};

