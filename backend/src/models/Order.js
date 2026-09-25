import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    customerName: {
      type: String,
      required: true
    },
    customerEmail: {
      type: String,
      required: false
    },
    customerPhone: {
      type: String,
      required: true
    },
    items: {
      type: Array,
      required: true
    },
    subtotal: {
      type: Number,
      default: 0
    },
    tax: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: true
    },
    orderType: {
      type: String,
      default: 'Table Service'
    },
    tableNumber: {
      type: String,
      default: '04'
    },
    paymentMethod: {
      type: String,
      default: 'UPI'
    },
    paymentStatus: {
      type: String,
      default: 'Paid'
    },
    paymentDetails: {
      transactionId: { type: String },
      upiId: { type: String },
      cardLast4: { type: String }
    },
    status: {
      type: String,
      enum: ['Ordered', 'Received', 'Preparing', 'Ready', 'Delivered'],
      default: 'Ordered'
    },
    notes: {
      type: String
    }
  },
  { timestamps: true }
);

orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ customerEmail: 1, customerPhone: 1 });
orderSchema.index({ createdAt: -1 });

export default mongoose.model('Order', orderSchema);

