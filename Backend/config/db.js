import mongoose from 'mongoose';

const connectDB = async (uri) => {
  try {
    await mongoose.connect(uri, {
      // options are optional in newer mongoose versions
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
