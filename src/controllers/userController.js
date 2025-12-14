// Users Controller
import prisma from '../config/database.js';

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { id: 'desc' },
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { name, email, role, status, permissions } = req.body;
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        role: role || 'viewer',
        status: status || 'active',
        permissions: permissions || [],
      },
    });
    res.json(newUser);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'User with this email already exists' });
    }
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { name, email, role, status, permissions } = req.body;
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name,
        email,
        role,
        status,
        permissions,
      },
    });
    res.json(updatedUser);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    await prisma.user.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ success: true });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }
    next(error);
  }
};

