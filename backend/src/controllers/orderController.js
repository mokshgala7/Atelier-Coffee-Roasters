import mongoose from 'mongoose';
import Order from '../models/Order.js';

// 1. Create a New Order (after payment completion)
export async function createOrder(request, response) {
  try {
    const {
      userId,
      customerName,
      customerEmail,
      customerPhone,
      items,
      subtotal,
      tax,
      total,
      orderType,
      tableNumber,
      paymentMethod,
      paymentStatus,
      paymentDetails,
      notes
    } = request.body;

    if (!items || !items.length) {
      return response.status(400).json({ error: 'Order must contain at least one item' });
    }

    if (!customerName || !customerPhone) {
      return response.status(400).json({ error: 'Customer name and phone number are required' });
    }

    const order = await Order.create({
      userId: userId || undefined,
      customerName,
      customerEmail,
      customerPhone,
      items,
      subtotal: subtotal || 0,
      tax: tax || 0,
      total: total || 0,
      orderType: orderType || 'Table Service',
      tableNumber: tableNumber || '04',
      paymentMethod: paymentMethod || 'UPI',
      paymentStatus: paymentStatus || 'Paid',
      paymentDetails: paymentDetails || {},
      status: 'Ordered',
      notes
    });

    return response.status(201).json({
      success: true,
      message: 'Order placed successfully and saved to MongoDB',
      order
    });
  } catch (error) {
    console.error('Error creating order in MongoDB:', error.message);
    return response.status(500).json({ error: 'Failed to place order', message: error.message });
  }
}

// 2. Get Past Orders for a Specific User
export async function getOrdersByUser(request, response) {
  try {
    const { userId } = request.params;
    const { email, phone } = request.query;

    const orConditions = [];

    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      orConditions.push({ userId });
    }
    if (email) {
      orConditions.push({ customerEmail: email.toLowerCase() });
    }
    if (phone) {
      orConditions.push({ customerPhone: phone });
    }

    if (orConditions.length === 0) {
      return response.json([]);
    }

    const orders = await Order.find({ $or: orConditions }).sort({ createdAt: -1 });
    return response.json(orders);
  } catch (error) {
    console.error('Error fetching user orders from MongoDB:', error.message);
    return response.status(500).json({ error: 'Failed to fetch user orders', message: error.message });
  }
}

// 3. Get All Recent Orders (Admin / General)
export async function getOrders(_request, response) {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(50);
    return response.json(orders);
  } catch (error) {
    console.error('Error fetching orders from MongoDB:', error.message);
    return response.status(500).json({ error: 'Failed to fetch orders', message: error.message });
  }
}

// 4. Get Single Order by ID
export async function getOrderById(request, response) {
  try {
    const order = await Order.findById(request.params.id);
    if (!order) return response.status(404).json({ error: 'Order not found' });
    return response.json(order);
  } catch (error) {
    console.error('Error fetching order from MongoDB:', error.message);
    return response.status(500).json({ error: 'Failed to fetch order', message: error.message });
  }
}

// 5. Delete Order (Cleanup / Admin)
export async function deleteOrder(request, response) {
  try {
    const deleted = await Order.findByIdAndDelete(request.params.id);
    if (!deleted) return response.status(404).json({ error: 'Order not found' });
    return response.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order from MongoDB:', error.message);
    return response.status(500).json({ error: 'Failed to delete order', message: error.message });
  }
}
