import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['interviewer', 'company'], required: true },
  
  // These are Flat properties (Correct)
  title: { type: String },
  bio: { type: String },
  skills: [String],
  hourlyRate: { type: Number, default: 0 },
  yearsExperience: { type: Number, default: 0 },
  avatar: { type: String },
  
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', UserSchema);