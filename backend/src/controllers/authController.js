import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import User from '../models/User.js';

// Helper to sign JWT
function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, name: user.name, role: user.role || 'user' },
    env.jwtSecret,
    { expiresIn: '7d' }
  );
}

// 1. User Registration (Sign-Up)
export async function register(request, response) {
  try {
    const { name, email, phone, password } = request.body;

    if (!name || !email || !phone || !password) {
      return response.status(400).json({
        success: false,
        message: 'All fields (Name, Email, Mobile number, Password) are required'
      });
    }

    if (password.length < 6) {
      return response.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if user already exists
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return response.status(409).json({
        success: false,
        message: 'An account with this email address already exists'
      });
    }

    // Hash password with bcrypt salt rounds = 10
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save to MongoDB
    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      password: hashedPassword,
      role: 'user'
    });

    const token = generateToken(newUser);
    const userPayload = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      createdAt: newUser.createdAt
    };

    return response.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: userPayload,
      data: {
        token,
        user: userPayload
      }
    });
  } catch (error) {
    console.error('Error during registration:', error.message);
    return response.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
}

// 2. User Login (Sign-In)
export async function login(request, response) {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(400).json({
        success: false,
        message: 'Email/Mobile and password are required'
      });
    }

    const identifier = email.trim();
    // Allow login by email or mobile number
    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { phone: identifier }
      ]
    });

    if (!user) {
      return response.status(401).json({
        success: false,
        message: 'Invalid credentials. User not found.'
      });
    }

    // Compare hashed password with bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return response.status(401).json({
        success: false,
        message: 'Invalid password. Please check your credentials.'
      });
    }

    const token = generateToken(user);
    const userPayload = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role || 'user',
      createdAt: user.createdAt
    };

    return response.json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: userPayload,
      data: {
        token,
        user: userPayload
      }
    });
  } catch (error) {
    console.error('Error during login:', error.message);
    return response.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
}

// 3. Current User Profile
export async function getMe(request, response) {
  try {
    // If request.user was already set by requireAuth middleware
    if (request.user) {
      const userPayload = {
        id: request.user._id,
        name: request.user.name,
        email: request.user.email,
        phone: request.user.phone,
        role: request.user.role || 'user',
        createdAt: request.user.createdAt
      };
      return response.json({
        success: true,
        user: userPayload,
        data: userPayload
      });
    }

    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return response.status(401).json({
        success: false,
        message: 'Authorization token required'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.jwtSecret);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return response.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const userPayload = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role || 'user',
      createdAt: user.createdAt
    };

    return response.json({
      success: true,
      user: userPayload,
      data: userPayload
    });
  } catch (error) {
    return response.status(401).json({
      success: false,
      message: 'Invalid or expired session token'
    });
  }
}

