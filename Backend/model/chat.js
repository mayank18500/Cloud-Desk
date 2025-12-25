import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  interviewId: { type: mongoose.Schema.Types.ObjectId, ref: 'Interview' }, // Link to the specific interview
  messages: [{
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  lastMessage: { type: String },
  lastMessageAt: { type: Date, default: Date.now }
});

export default mongoose.model('Chat', ChatSchema);