import mongoose from 'mongoose';
export async function connectDatabase(uri) { if (uri) await mongoose.connect(uri); }
