import mongoose from 'mongoose';

export async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected to the database');
  } catch (error) {
    console.error('Failed to connect to the database:', error.message);
    throw error;
  }
}
