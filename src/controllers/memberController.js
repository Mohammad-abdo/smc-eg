// Members Controller
import prisma from '../config/database.js';

export const getAllMembers = async (req, res, next) => {
  try {
    const members = await prisma.member.findMany({
      orderBy: [{ order: 'asc' }, { id: 'asc' }],
    });
    res.json(members);
  } catch (error) {
    next(error);
  }
};

export const getMemberById = async (req, res, next) => {
  try {
    const member = await prisma.member.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.json(member);
  } catch (error) {
    next(error);
  }
};

export const createMember = async (req, res, next) => {
  try {
    const member = await prisma.member.create({ data: req.body });
    res.json(member);
  } catch (error) {
    next(error);
  }
};

export const updateMember = async (req, res, next) => {
  try {
    const member = await prisma.member.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });
    res.json(member);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Member not found' });
    }
    next(error);
  }
};

export const deleteMember = async (req, res, next) => {
  try {
    await prisma.member.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ success: true });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Member not found' });
    }
    next(error);
  }
};

