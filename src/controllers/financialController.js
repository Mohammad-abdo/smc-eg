// Financial Controller
import prisma from '../config/database.js';

// Revenue endpoints
export const getAllRevenue = async (req, res, next) => {
  try {
    const revenue = await prisma.financialRevenue.findMany({
      orderBy: { year: 'desc' },
    });
    res.json(revenue);
  } catch (error) {
    next(error);
  }
};

export const createRevenue = async (req, res, next) => {
  try {
    const revenue = await prisma.financialRevenue.create({ data: req.body });
    res.json(revenue);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Revenue for this year already exists' });
    }
    next(error);
  }
};

export const updateRevenue = async (req, res, next) => {
  try {
    const revenue = await prisma.financialRevenue.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });
    res.json(revenue);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Revenue record not found' });
    }
    next(error);
  }
};

export const deleteRevenue = async (req, res, next) => {
  try {
    await prisma.financialRevenue.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ success: true });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Revenue record not found' });
    }
    next(error);
  }
};

// Production endpoints
export const getAllProduction = async (req, res, next) => {
  try {
    const production = await prisma.financialProduction.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(production);
  } catch (error) {
    next(error);
  }
};

export const createProduction = async (req, res, next) => {
  try {
    const production = await prisma.financialProduction.create({ data: req.body });
    res.json(production);
  } catch (error) {
    next(error);
  }
};

export const updateProduction = async (req, res, next) => {
  try {
    const production = await prisma.financialProduction.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });
    res.json(production);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Production record not found' });
    }
    next(error);
  }
};

export const deleteProduction = async (req, res, next) => {
  try {
    await prisma.financialProduction.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ success: true });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Production record not found' });
    }
    next(error);
  }
};

// Export endpoints
export const getAllExport = async (req, res, next) => {
  try {
    const exports = await prisma.financialExport.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(exports);
  } catch (error) {
    next(error);
  }
};

export const createExport = async (req, res, next) => {
  try {
    const exportRecord = await prisma.financialExport.create({ data: req.body });
    res.json(exportRecord);
  } catch (error) {
    next(error);
  }
};

export const updateExport = async (req, res, next) => {
  try {
    const exportRecord = await prisma.financialExport.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });
    res.json(exportRecord);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Export record not found' });
    }
    next(error);
  }
};

export const deleteExport = async (req, res, next) => {
  try {
    await prisma.financialExport.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ success: true });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Export record not found' });
    }
    next(error);
  }
};

