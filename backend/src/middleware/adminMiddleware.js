import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import User from '../models/User.js';

export async function requireAdmin(request, response, next) {
  try {
    // If request.user was already resolved by requireAuth
    if (request.user) {
      if (request.user.role === 'admin') {
        return next();
      }
      return response.status(403).json({
        success: false,
        message: 'Access denied. Administrator privileges required.'
      });
    }

    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return response.status(401).json({
        success: false,
        message: 'Authentication required. Authorization header missing.'
      });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, env.jwtSecret);
    } catch (err) {
      return response.status(401).json({
        success: false,
        message: 'Invalid or expired authorization token.'
      });
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return response.status(401).json({
        success: false,
        message: 'User account not found.'
      });
    }

    if (user.role !== 'admin') {
      return response.status(403).json({
        success: false,
        message: 'Access denied. Administrator privileges required.'
      });
    }

    request.user = user;
    request.userId = user._id;
    next();
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: 'Admin authorization failed.',
      error: error.message
    });
  }
}

