// Complaints Controller
import prisma from '../config/database.js';

export const getAllComplaints = async (req, res, next) => {
  try {
    const complaints = await prisma.complaint.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(complaints);
  } catch (error) {
    next(error);
  }
};

export const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await prisma.complaint.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }
    res.json(complaint);
  } catch (error) {
    next(error);
  }
};

export const createComplaint = async (req, res, next) => {
  try {
    const complaint = await prisma.complaint.create({
      data: {
        ...req.body,
        date: req.body.date ? new Date(req.body.date) : new Date(),
      },
    });
    res.json(complaint);
  } catch (error) {
    next(error);
  }
};

export const updateComplaint = async (req, res, next) => {
  try {
    const complaint = await prisma.complaint.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });
    res.json(complaint);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Complaint not found' });
    }
    next(error);
  }
};

