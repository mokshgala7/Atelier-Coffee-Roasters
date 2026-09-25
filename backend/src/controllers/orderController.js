import Order from '../models/Order.js';

export async function createOrder(request, response) {
  try {
    const { items, total, status, orderType, tableNumber, customerName, customerPhone, notes } = request.body;
    
    if (!items || !items.length) {
      return response.status(400).json({ error: 'Order must contain at least one item' });
    }

    const order = await Order.create({
      items,
      total: total || 0,
      status: status || 'Received',
      orderType: orderType || 'Table Service',
      tableNumber: tableNumber || '04',
      customerName: customerName || 'Patron',
      customerPhone,
      notes
    });

    return response.status(201).json({ success: true, order });
  } catch (error) {
    console.error('Error creating order in MongoDB:', error.message);
    return response.status(500).json({ error: 'Failed to create order', message: error.message });
  }
}

export async function getOrders(_request, response) {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(50);
    return response.json(orders);
  } catch (error) {
    console.error('Error fetching orders from MongoDB:', error.message);
    return response.status(500).json({ error: 'Failed to fetch orders', message: error.message });
  }
}

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

export async function deleteOrder(request, response) {
  try {
    const deleted = await Order.findByIdAndDelete(request.params.id);
    if (!deleted) return response.status(404).json({ error: 'Order not found' });
    return response.json({ success: true, message: 'Order deleted' });
  } catch (error) {
    console.error('Error deleting order from MongoDB:', error.message);
    return response.status(500).json({ error: 'Failed to delete order', message: error.message });
  }
}
