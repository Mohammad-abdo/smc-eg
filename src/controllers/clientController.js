// Clients Controller
import prisma from '../config/database.js';

export const getAllClients = async (req, res, next) => {
  try {
    const { status } = req.query;
    const where = status && status !== 'all' ? { status } : {};
    
    const clients = await prisma.client.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    });
    
    // Map sortOrder to order for frontend compatibility
    const mappedClients = clients.map(client => {
      const { sortOrder, ...rest } = client;
      return { ...rest, order: sortOrder };
    });
    
    res.json(mappedClients);
  } catch (error) {
    next(error);
  }
};

export const getClientById = async (req, res, next) => {
  try {
    const client = await prisma.client.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    // Map sortOrder to order for frontend compatibility
    const { sortOrder, ...rest } = client;
    res.json({ ...rest, order: sortOrder });
  } catch (error) {
    next(error);
  }
};

export const createClient = async (req, res, next) => {
  try {
    // Map 'order' to 'sortOrder' as per Prisma schema
    const { order, ...rest } = req.body;
    const clientData = {
      ...rest,
      sortOrder: order !== undefined ? order : 0,
    };
    
    const client = await prisma.client.create({ data: clientData });
    
    // Map sortOrder back to order for frontend compatibility
    const { sortOrder, ...clientRest } = client;
    res.json({ ...clientRest, order: sortOrder });
  } catch (error) {
    next(error);
  }
};

export const updateClient = async (req, res, next) => {
  try {
    // Map 'order' to 'sortOrder' as per Prisma schema
    const { order, ...rest } = req.body;
    const clientData = {
      ...rest,
      ...(order !== undefined && { sortOrder: order }),
    };
    
    const client = await prisma.client.update({
      where: { id: parseInt(req.params.id) },
      data: clientData,
    });
    
    // Map sortOrder back to order for frontend compatibility
    const { sortOrder, ...clientRest } = client;
    res.json({ ...clientRest, order: sortOrder });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Client not found' });
    }
    next(error);
  }
};

export const deleteClient = async (req, res, next) => {
  try {
    await prisma.client.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ success: true });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Client not found' });
    }
    next(error);
  }
};

