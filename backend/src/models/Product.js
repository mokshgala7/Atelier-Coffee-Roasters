import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    image: { type: String },
    nutrition: {
      calories: { type: String, default: '120 kcal' },
      protein: { type: String, default: '6g' },
      carbs: { type: String, default: '18g' },
      fat: { type: String, default: '6g' }
    },
    available: { type: Boolean, default: true }
  },
  { timestamps: true }
);

productSchema.index({ category: 1 });

export default mongoose.model('Product', productSchema);

