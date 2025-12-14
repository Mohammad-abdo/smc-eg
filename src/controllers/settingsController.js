// Settings Controller
import prisma from '../config/database.js';

export const getAllSettings = async (req, res, next) => {
  try {
    const settings = await prisma.siteSetting.findMany({
      orderBy: { key: 'asc' },
    });
    res.json(settings);
  } catch (error) {
    next(error);
  }
};

export const getSettingByKey = async (req, res, next) => {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: req.params.key },
    });
    if (!setting) {
      return res.status(404).json({ error: 'Setting not found' });
    }
    res.json(setting);
  } catch (error) {
    next(error);
  }
};

export const createOrUpdateSetting = async (req, res, next) => {
  try {
    const { key, valueEn, valueAr } = req.body;
    const setting = await prisma.siteSetting.upsert({
      where: { key },
      update: { valueEn: valueEn || null, valueAr: valueAr || null },
      create: { key, valueEn: valueEn || null, valueAr: valueAr || null },
    });
    res.json(setting);
  } catch (error) {
    next(error);
  }
};

