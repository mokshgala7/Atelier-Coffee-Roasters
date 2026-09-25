import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    author: { type: String, required: true },
    publication: { type: String, default: 'Verified Patron' },
    quote: { type: String, required: true },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    favoriteItem: { type: String },
    date: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model('Review', reviewSchema);
