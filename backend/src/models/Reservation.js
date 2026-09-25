import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String },
    guests: { type: String, default: '2 Guests' },
    date: { type: String, required: true },
    time: { type: String, required: true },
    notes: { type: String },
    status: { type: String, default: 'Confirmed' }
  },
  { timestamps: true }
);

export default mongoose.model('Reservation', reservationSchema);
