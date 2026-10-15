import mongoose from 'mongoose';

let isConnected = false;

// In-memory fallback store
export const memoryStore = {
  data: [],
  isActive: false
};

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/blackcoffer_dashboard';
  
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`⚠️  MongoDB connection failed: ${error.message}`);
    console.log('📦 Switching to in-memory fallback store...');
    memoryStore.isActive = true;
    return false;
  }
};

export const getConnectionStatus = () => ({
  connected: isConnected,
  usingMemory: memoryStore.isActive,
});
