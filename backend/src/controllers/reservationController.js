import Reservation from '../models/Reservation.js';

export async function getReservations(_request, response) {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 });
    return response.json(reservations);
  } catch (error) {
    console.error('Error fetching reservations from MongoDB:', error.message);
    return response.status(500).json({ error: 'Failed to fetch reservations', message: error.message });
  }
}

export async function createReservation(request, response) {
  try {
    const { name, phone, guests, date, time, notes } = request.body;
    
    if (!name || !date || !time) {
      return response.status(400).json({ error: 'Name, date, and time are required' });
    }

    const reservation = await Reservation.create({
      name,
      phone,
      guests: guests || '2 Guests',
      date,
      time,
      notes,
      status: 'Confirmed'
    });

    return response.status(201).json({ success: true, reservation });
  } catch (error) {
    console.error('Error creating reservation in MongoDB:', error.message);
    return response.status(500).json({ error: 'Failed to save reservation', message: error.message });
  }
}
