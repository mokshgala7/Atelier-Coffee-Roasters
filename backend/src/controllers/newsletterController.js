import Subscriber from '../models/Subscriber.js';

// POST /api/newsletter
export async function subscribe(request, response) {
  try {
    const { email } = request.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return response.status(400).json({
        success: false,
        message: 'A valid email address is required'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if already subscribed (safe idempotent response, no duplicates)
    const existing = await Subscriber.findOne({ email: normalizedEmail });
    if (existing) {
      return response.status(200).json({
        success: true,
        message: 'You are already subscribed to the Atelier Roastery Dispatch.',
        data: existing
      });
    }

    const newSubscriber = await Subscriber.create({
      email: normalizedEmail,
      subscribedAt: new Date()
    });

    return response.status(201).json({
      success: true,
      message: 'Subscribed to Atelier Roastery Dispatch successfully',
      data: newSubscriber
    });
  } catch (error) {
    console.error('Error saving newsletter subscriber:', error.message);
    return response.status(500).json({
      success: false,
      message: 'Failed to process subscription',
      error: error.message
    });
  }
}

// GET /api/newsletter (Admin only)
export async function getSubscribers(_request, response) {
  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });
    return response.json({
      success: true,
      count: subscribers.length,
      subscribers,
      data: subscribers
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: 'Failed to fetch subscribers',
      error: error.message
    });
  }
}
