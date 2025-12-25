import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [String],
  budget: { type: Number }, // Max budget for the interviewer
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
  applicants: [{
    interviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    appliedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'selected', 'rejected'], default: 'pending' }
  }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Job', JobSchema);