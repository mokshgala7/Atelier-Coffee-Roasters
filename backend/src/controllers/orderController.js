import mongoose from 'mongoose';
import Order from '../models/Order.js';

// 1. Create a New Order (after payment completion)
export async function createOrder(request, response) {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      items,
      orderType,
      tableNumber,
      paymentMethod,
      paymentStatus,
      paymentDetails,
      notes
    } = request.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return response.status(400).json({
        success: false,
        message: 'Order must contain at least one item'
      });
    }

    if (!customerName || !customerPhone) {
      return response.status(400).json({
        success: false,
        message: 'Customer name and phone number are required'
      });
    }

    // Security: Authenticated identity from JWT token takes strict precedence.
    // If request is unauthenticated, client-sent userId is ignored to prevent user impersonation.
    const authenticatedUserId = request.userId || undefined;

    // Validate and sanitize order items
    const sanitizedItems = [];
    for (const item of items) {
      const price = Number(item.price);
      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
      if (Number.isNaN(price) || price < 0) {
        return response.status(400).json({
          success: false,
          message: `Invalid price for item: ${item.name || 'unnamed'}`
        });
      }
      sanitizedItems.push({
        id: item.id || item.slug || 'item',
        name: (item.name || 'Item').trim(),
        price,
        quantity: qty,
        selectedAddOns: Array.isArray(item.selectedAddOns) ? item.selectedAddOns : []
      });
    }

    // Backend price recalculation for security
    const validatedSubtotal = sanitizedItems.reduce((acc, item) => {
      const itemPrice = Number(item.price) || 0;
      const itemQty = Math.max(1, Number(item.quantity) || 1);
      return acc + (itemPrice * itemQty);
    }, 0);
    const validatedTax = Math.round(validatedSubtotal * 0.05);
    const validatedTotal = validatedSubtotal + validatedTax;

    const order = await Order.create({
      userId: authenticatedUserId,
      customerName: customerName.trim(),
      customerEmail: customerEmail ? customerEmail.trim().toLowerCase() : undefined,
      customerPhone: customerPhone.trim(),
      items: sanitizedItems,
      subtotal: validatedSubtotal,
      tax: validatedTax,
      total: validatedTotal,
      orderType: orderType || 'Table Service',
      tableNumber: tableNumber || '04',
      paymentMethod: paymentMethod || 'UPI',
      paymentStatus: paymentStatus || 'Paid',
      paymentDetails: paymentDetails || {},
      status: 'Ordered',
      notes: notes ? notes.trim() : undefined
    });

    return response.status(201).json({
      success: true,
      message: 'Order placed successfully and saved to MongoDB',
      order,
      data: order
    });
  } catch (error) {
    console.error('Error creating order in MongoDB:', error.message);
    return response.status(500).json({
      success: false,
      message: 'Failed to place order',
      error: error.message
    });
  }
}

// 2. Get Past Orders for a Specific User (Ownership or Admin)
export async function getOrdersByUser(request, response) {
  try {
    const requestedUserId = request.params.userId;
    const targetUserId = requestedUserId === 'me'
      ? request.userId?.toString()
      : requestedUserId;

    // Check ownership or admin privileges
    const isAdmin = request.user?.role === 'admin';
    const isOwner = request.userId && request.userId.toString() === targetUserId;

    if (!isAdmin && !isOwner) {
      return response.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own orders.'
      });
    }

    const { email, phone } = request.query;
    const orConditions = [];

    if (targetUserId && mongoose.Types.ObjectId.isValid(targetUserId)) {
      orConditions.push({ userId: new mongoose.Types.ObjectId(targetUserId) });
    }

    // For non-admins, ensure query params match authenticated user's profile
    if (email) {
      const normalizedEmail = email.toLowerCase().trim();
      if (isAdmin || (request.user?.email && request.user.email.toLowerCase() === normalizedEmail)) {
        orConditions.push({ customerEmail: normalizedEmail });
      }
    }

    if (phone) {
      const normalizedPhone = phone.trim();
      if (isAdmin || (request.user?.phone && request.user.phone.trim() === normalizedPhone)) {
        orConditions.push({ customerPhone: normalizedPhone });
      }
    }

    if (orConditions.length === 0) {
      return response.json([]);
    }

    const orders = await Order.find({ $or: orConditions }).sort({ createdAt: -1 });
    return response.json(orders);
  } catch (error) {
    console.error('Error fetching user orders from MongoDB:', error.message);
    return response.status(500).json({
      success: false,
      message: 'Failed to fetch user orders',
      error: error.message
    });
  }
}

// 3. Get All Recent Orders (Admin Only)
export async function getOrders(_request, response) {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(50);
    return response.json({
      success: true,
      count: orders.length,
      orders,
      data: orders
    });
  } catch (error) {
    console.error('Error fetching orders from MongoDB:', error.message);
    return response.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
}

// 4. Get Single Order by ID (Authenticated Owner or Admin)
export async function getOrderById(request, response) {
  try {
    if (!mongoose.Types.ObjectId.isValid(request.params.id)) {
      return response.status(400).json({ success: false, message: 'Invalid Order ID format' });
    }

    const order = await Order.findById(request.params.id);
    if (!order) {
      return response.status(404).json({ success: false, message: 'Order not found' });
    }

    // Verify ownership or admin privileges
    const isAdmin = request.user?.role === 'admin';
    const isOwner = (order.userId && order.userId.toString() === request.userId?.toString()) ||
                    (order.customerEmail && order.customerEmail.toLowerCase() === request.user?.email?.toLowerCase());

    if (!isAdmin && !isOwner) {
      return response.status(403).json({
        success: false,
        message: 'Access denied. You do not have permission to view this order.'
      });
    }

    return response.json({
      success: true,
      order,
      data: order
    });
  } catch (error) {
    console.error('Error fetching order from MongoDB:', error.message);
    return response.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
}

// 5. Delete Order (Admin Only)
export async function deleteOrder(request, response) {
  try {
    if (!mongoose.Types.ObjectId.isValid(request.params.id)) {
      return response.status(400).json({ success: false, message: 'Invalid Order ID format' });
    }
    const deleted = await Order.findByIdAndDelete(request.params.id);
    if (!deleted) {
      return response.status(404).json({ success: false, message: 'Order not found' });
    }
    return response.json({
      success: true,
      message: 'Order deleted successfully',
      data: deleted
    });
  } catch (error) {
    console.error('Error deleting order from MongoDB:', error.message);
    return response.status(500).json({
      success: false,
      message: 'Failed to delete order',
      error: error.message
    });
  }
}


