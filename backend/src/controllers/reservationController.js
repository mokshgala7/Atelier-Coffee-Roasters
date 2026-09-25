import Reservation from '../models/Reservation.js';

function isTimeWithinRoasteryHours(timeStr) {
  if (!timeStr) return false;
  const [hours, minutes] = timeStr.split(':').map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return false;
  const totalMinutes = hours * 60 + minutes;
  // 07:00 AM (420 mins) to 11:59 PM (1439 mins)
  return totalMinutes >= 420 && totalMinutes <= 1439;
}

export async function getReservations(request, response) {
  try {
    const isAdmin = request.user?.role === 'admin';
    let query = {};

    // If not admin, restrict to reservations belonging to this user
    if (!isAdmin) {
      const orConditions = [];
      if (request.userId) {
        orConditions.push({ userId: request.userId });
      }
      if (request.user?.phone) {
        orConditions.push({ phone: request.user.phone });
      }
      if (request.user?.name) {
        orConditions.push({ name: request.user.name });
      }

      if (orConditions.length === 0) {
        return response.json([]);
      }
      query = { $or: orConditions };
    }

    const reservations = await Reservation.find(query).sort({ createdAt: -1 });
    return response.json(reservations);
  } catch (error) {
    console.error('Error fetching reservations from MongoDB:', error.message);
    return response.status(500).json({
      success: false,
      message: 'Failed to fetch reservations',
      error: error.message
    });
  }
}

export async function createReservation(request, response) {
  try {
    const { name, phone, guests, date, time, notes } = request.body;

    if (!name || !date || !time) {
      return response.status(400).json({
        success: false,
        message: 'Name, date, and time are required'
      });
    }

    if (typeof name !== 'string' || name.trim().length < 2) {
      return response.status(400).json({
        success: false,
        message: 'Name must be at least 2 characters long'
      });
    }

    if (!isTimeWithinRoasteryHours(time)) {
      return response.status(400).json({
        success: false,
        message: 'Reservation time must be within roastery operating hours (07:00 AM – 11:59 PM).'
      });
    }

    const reservation = await Reservation.create({
      userId: request.userId || undefined,
      name: name.trim(),
      phone: phone ? phone.trim() : undefined,
      guests: guests || '2 Guests',
      date,
      time,
      notes: notes ? notes.trim() : undefined,
      status: 'Confirmed'
    });

    return response.status(201).json({
      success: true,
      message: 'Reservation confirmed successfully',
      reservation,
      data: reservation
    });
  } catch (error) {
    console.error('Error creating reservation in MongoDB:', error.message);
    return response.status(500).json({
      success: false,
      message: 'Failed to save reservation',
      error: error.message
    });
  }
}


