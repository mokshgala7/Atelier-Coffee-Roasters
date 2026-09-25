import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'atelier_coffee_roasters_jwt_secret_key_2026';

// Helper to sign JWT
function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// 1. User Registration (Sign-Up)
export async function register(request, response) {
  try {
    const { name, email, phone, password } = request.body;

    if (!name || !email || !phone || !password) {
      return response.status(400).json({ error: 'All fields (Name, Email, Mobile number, Password) are required' });
    }

    if (password.length < 6) {
      return response.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return response.status(400).json({ error: 'An account with this email address already exists' });
    }

    // Hash password with bcrypt salt rounds = 10
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save to MongoDB
    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      password: hashedPassword
    });

    const token = generateToken(newUser);

    return response.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        createdAt: newUser.createdAt
      }
    });
  } catch (error) {
    console.error('Error during registration:', error.message);
    return response.status(500).json({ error: 'Registration failed', message: error.message });
  }
}

// 2. User Login (Sign-In)
export async function login(request, response) {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(400).json({ error: 'Email/Mobile and password are required' });
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
      return response.status(401).json({ error: 'Invalid credentials. User not found.' });
    }

    // Compare hashed password with bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return response.status(401).json({ error: 'Invalid password. Please check your credentials.' });
    }

    const token = generateToken(user);

    return response.json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Error during login:', error.message);
    return response.status(500).json({ error: 'Login failed', message: error.message });
  }
}

// 3. Current User Profile
export async function getMe(request, response) {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return response.status(401).json({ error: 'Authorization token required' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return response.status(404).json({ error: 'User not found' });
    }

    return response.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    return response.status(401).json({ error: 'Invalid or expired session token' });
  }
}
