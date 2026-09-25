import Order from '../models/Order.js';
import Reservation from '../models/Reservation.js';
import User from '../models/User.js';
import Review from '../models/Review.js';
import Product from '../models/Product.js';

export async function getAdminDashboard(_request, response) {
  try {
    const [totalOrders, totalUsers, totalReservations, totalReviews, totalProducts, recentOrders] =
      await Promise.all([
        Order.countDocuments(),
        User.countDocuments(),
        Reservation.countDocuments(),
        Review.countDocuments(),
        Product.countDocuments(),
        Order.find().sort({ createdAt: -1 }).limit(10)
      ]);

    const revenueResult = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: '$total' } } }
    ]);
    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    return response.json({
      success: true,
      data: {
        totalOrders,
        totalRevenue,
        totalUsers,
        totalReservations,
        totalReviews,
        totalProducts,
        recentOrders
      }
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: 'Failed to fetch admin dashboard metrics',
      error: error.message
    });
  }
}

export async function getAllUsers(_request, response) {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return response.json({
      success: true,
      count: users.length,
      users,
      data: users
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
}

