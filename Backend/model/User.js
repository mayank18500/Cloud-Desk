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
  website: { type: String },
  portfolio: { type: String },
  companyName: { type: String },
  location: { type: String },
  avatar: { type: String },
  cv: {
    type: String,
    required: function () { return this.role === 'interviewer'; }
  }, // Path to interviewer's CV

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', UserSchema);