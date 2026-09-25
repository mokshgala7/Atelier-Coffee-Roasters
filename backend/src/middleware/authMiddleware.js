import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import User from '../models/User.js';

export async function requireAuth(request, response, next) {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return response.status(401).json({
        success: false,
        message: 'Authentication required. Bearer token missing.'
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

    request.user = user;
    request.userId = user._id;
    next();
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: 'Authentication verification failed.',
      error: error.message
    });
  }
}

// Optional authentication middleware: attaches user if token exists and is valid
export async function optionalAuth(request, _response, next) {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      request.user = null;
      request.userId = null;
      return next();
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, env.jwtSecret);
    } catch (err) {
      request.user = null;
      request.userId = null;
      return next();
    }

    const user = await User.findById(decoded.id).select('-password');
    if (user) {
      request.user = user;
      request.userId = user._id;
    } else {
      request.user = null;
      request.userId = null;
    }
    next();
  } catch (err) {
    request.user = null;
    request.userId = null;
    next();
  }
}


