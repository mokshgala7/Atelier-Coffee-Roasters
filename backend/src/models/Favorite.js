import mongoose from 'mongoose';
const favoriteSchema = new mongoose.Schema({ user: mongoose.Schema.Types.ObjectId, product: mongoose.Schema.Types.ObjectId });
export default mongoose.model('Favorite', favoriteSchema);
