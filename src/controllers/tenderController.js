// Tenders Controller
import prisma from '../config/database.js';

export const getAllTenders = async (req, res, next) => {
  try {
    const tenders = await prisma.tender.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(tenders);
  } catch (error) {
    next(error);
  }
};

export const getTenderById = async (req, res, next) => {
  try {
    const tender = await prisma.tender.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { submissions: true },
    });
    if (!tender) {
      return res.status(404).json({ error: 'Tender not found' });
    }
    res.json(tender);
  } catch (error) {
    next(error);
  }
};

export const createTender = async (req, res, next) => {
  try {
    const tender = await prisma.tender.create({
      data: {
        ...req.body,
        deadline: req.body.deadline ? new Date(req.body.deadline) : null,
      },
    });
    res.json(tender);
  } catch (error) {
    next(error);
  }
};

export const updateTender = async (req, res, next) => {
  try {
    const tender = await prisma.tender.update({
      where: { id: parseInt(req.params.id) },
      data: {
        ...req.body,
        deadline: req.body.deadline ? new Date(req.body.deadline) : undefined,
      },
    });
    res.json(tender);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Tender not found' });
    }
    next(error);
  }
};

export const deleteTender = async (req, res, next) => {
  try {
    await prisma.tender.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ success: true });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Tender not found' });
    }
    next(error);
  }
};

export const submitTender = async (req, res, next) => {
  try {
    const { companyName, contactName, email, phone, files } = req.body;
    const tenderId = parseInt(req.params.id);

    const submission = await prisma.tenderSubmission.create({
      data: {
        tenderId,
        companyName,
        contactName,
        email,
        phone: phone || null,
        files: files || null,
        status: 'pending',
      },
    });
    res.json(submission);
  } catch (error) {
    next(error);
  }
};

export const getTenderSubmissions = async (req, res, next) => {
  try {
    const tenderId = parseInt(req.params.id);
    const submissions = await prisma.tenderSubmission.findMany({
      where: { tenderId },
      orderBy: { submittedAt: 'desc' },
    });
    res.json(submissions);
  } catch (error) {
    next(error);
  }
};

export const updateTenderSubmission = async (req, res, next) => {
  try {
    const submission = await prisma.tenderSubmission.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });
    res.json(submission);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Submission not found' });
    }
    next(error);
  }
};

