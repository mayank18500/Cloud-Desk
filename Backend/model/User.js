import express from "express";
import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['interviewer','company'], required: true },
  bio: String,
  skills: [String],
  pricing:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "PricingSchema" ,
  },
  portfolio: [String],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', UserSchema);

