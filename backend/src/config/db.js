import mongoose from 'mongoose';

export async function connectDatabase(uri = process.env.MONGODB_URI) {
  if (!uri) {
    console.warn('⚠️ MONGODB_URI is not defined. Skipping database connection.');
    return false;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`✅ MongoDB Atlas connected successfully to database: ${mongoose.connection.name}`);
    return true;
  } catch (error) {
    console.error('❌ MongoDB Atlas connection error:', error.message);
    throw error;
  }
}

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB connection disconnected.');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB runtime error:', err.message);
});
