import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
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

reservationSchema.index({ date: 1 });
reservationSchema.index({ phone: 1 });
reservationSchema.index({ createdAt: -1 });

export default mongoose.model('Reservation', reservationSchema);

