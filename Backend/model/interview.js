import mongoose from "mongoose";

const InterviewSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  interviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  candidateName: { type: String, required: true },
  role: { type: String, required: true },
  date: { type: String, required: true }, // Format: "YYYY-MM-DD"
  time: { type: String }, // Format: "HH:mm"
  // notes field removed
  cv: { type: String }, // Path to uploaded file
  description: { type: String },

  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  result: { type: String, enum: ['passed', 'failed', null], default: null },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Interview', InterviewSchema);