import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    items: { type: Array, required: true },
    total: { type: Number, required: true },
    status: { type: String, default: 'Received' },
    orderType: { type: String, default: 'Table Service' },
    tableNumber: { type: String },
    customerName: { type: String },
    customerPhone: { type: String },
    notes: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
