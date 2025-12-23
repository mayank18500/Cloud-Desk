import mongoose from "mongoose";

const Schema = mongoose.Schema;

const interviewerSchema = new Schema({
  role: {
    type: String,
    enum: ['interviewer'], // Only interviewer for this schema
    default: 'interviewer',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  skills: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
  portfolio: {
    type: String,
    required: true,
  },
  hourlyRate: {
    type: Money,
    required: true,
  },
}, { timestamps: true }); // Adds createdAt and updatedAt automatically

export default mongoose.model("Interviewer", interviewerSchema);
