import mongoose from "mongoose";

const Schema = mongoose.Schema;

const interviewerSchema = new Schema({
  role: {
    type: String,
    enum: ['interviewer'], 
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
  },
  hourlyRate: {
    type: String,
  },
}, { timestamps: true }); 

export default mongoose.model("Interviewer", interviewerSchema);
