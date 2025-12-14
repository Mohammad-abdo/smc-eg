// Statistics Controller
import prisma from '../config/database.js';

export const getOverview = async (req, res, next) => {
  try {
    const [totalProducts, totalNews, totalContacts, totalComplaints, viewsResult] = await Promise.all([
      prisma.product.count(),
      prisma.news.count(),
      prisma.contact.count(),
      prisma.complaint.count(),
      prisma.product.aggregate({ _sum: { views: true } }),
    ]);
    
    res.json({
      totalProducts,
      totalNews,
      totalContacts,
      totalComplaints,
      totalRevenue: '78M',
      monthlyGrowth: '+15%',
      totalViews: viewsResult._sum.views || 0,
    });
  } catch (error) {
    next(error);
  }
};

export const getMonthly = async (req, res, next) => {
  try {
    // Mock monthly data - can be replaced with actual database queries
    res.json([
      { month: 'Jan', views: 2340, visitors: 1500 },
      { month: 'Feb', views: 2900, visitors: 1800 },
      { month: 'Mar', views: 3200, visitors: 2000 },
      { month: 'Apr', views: 2780, visitors: 1900 },
      { month: 'May', views: 1890, visitors: 1300 },
      { month: 'Jun', views: 2390, visitors: 1500 },
    ]);
  } catch (error) {
    next(error);
  }
};

export const getProductViews = async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      select: { name: true, views: true },
      orderBy: { views: 'desc' },
    });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

