import express from "express";
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['interviewer','company'], required: true },
  bio: String,
  skills: [String],
  pricing: PricingSchema,
  portfolio: [String],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', UserSchema);

const PricingSchema = new mongoose.Schema({
  hourlyRate: Number,
  projectRate: Number
});