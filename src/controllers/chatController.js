// Chat Controller
import prisma from '../config/database.js';

export const getAllChatMessages = async (req, res, next) => {
  try {
    const messages = await prisma.chatMessage.findMany({
      orderBy: { timestamp: 'desc' },
    });
    res.json(messages);
  } catch (error) {
    next(error);
  }
};

export const createChatMessage = async (req, res, next) => {
  try {
    const message = await prisma.chatMessage.create({ data: req.body });
    res.json(message);
  } catch (error) {
    next(error);
  }
};

export const updateChatMessage = async (req, res, next) => {
  try {
    const message = await prisma.chatMessage.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });
    res.json(message);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Chat message not found' });
    }
    next(error);
  }
};

