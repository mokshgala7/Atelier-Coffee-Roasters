import mongoose from 'mongoose';
import User from '../models/User.js';

// GET /api/users/me or GET /api/users/:id
export async function getUser(request, response) {
  try {
    const isMe = request.path === '/me' || !request.params.id || request.params.id === 'me';
    const targetId = isMe ? request.userId?.toString() : request.params.id;

    if (!targetId || !mongoose.Types.ObjectId.isValid(targetId)) {
      return response.status(400).json({ success: false, message: 'Valid User ID is required' });
    }

    // Security check: User can only access their own profile unless admin
    const isAdmin = request.user?.role === 'admin';
    const isSelf = request.userId && request.userId.toString() === targetId;

    if (!isAdmin && !isSelf) {
      return response.status(403).json({
        success: false,
        message: 'Access denied. You may only view your own profile.'
      });
    }

    const user = await User.findById(targetId).select('-password');
    if (!user) {
      return response.status(404).json({ success: false, message: 'User not found' });
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
    return response.status(500).json({ success: false, message: error.message });
  }
}

// PUT /api/users/:id
export async function updateUser(request, response) {
  try {
    const isMe = request.params.id === 'me';
    const targetId = isMe ? request.userId?.toString() : request.params.id;

    if (!targetId || !mongoose.Types.ObjectId.isValid(targetId)) {
      return response.status(400).json({ success: false, message: 'Valid User ID is required' });
    }

    // Security check: only self or admin can update profile
    const isAdmin = request.user?.role === 'admin';
    const isSelf = request.userId && request.userId.toString() === targetId;

    if (!isAdmin && !isSelf) {
      return response.status(403).json({
        success: false,
        message: 'Access denied. You may only modify your own account.'
      });
    }

    const { name, phone } = request.body;
    const updates = {};

    if (name !== undefined) {
      if (!name || typeof name !== 'string' || name.trim().length < 2) {
        return response.status(400).json({ success: false, message: 'Name must be at least 2 characters' });
      }
      updates.name = name.trim();
    }

    if (phone !== undefined) {
      if (!phone || typeof phone !== 'string' || phone.trim().length < 7) {
        return response.status(400).json({ success: false, message: 'Phone must be a valid phone number' });
      }
      updates.phone = phone.trim();
    }

    // Role modification is exclusively permitted for verified administrators
    if (request.body.role && isAdmin) {
      if (['user', 'admin'].includes(request.body.role)) {
        updates.role = request.body.role;
      }
    }

    // Execute update with only whitelisted fields
    const updatedUser = await User.findByIdAndUpdate(
      targetId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return response.status(404).json({ success: false, message: 'User not found' });
    }

    const userPayload = {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role || 'user',
      createdAt: updatedUser.createdAt
    };

    return response.json({
      success: true,
      message: 'Profile updated successfully',
      user: userPayload,
      data: userPayload
    });
  } catch (error) {
    return response.status(500).json({ success: false, message: error.message });
  }
}


