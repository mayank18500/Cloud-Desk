import express from "express";
import mongoose from "mongoose";
const PricingSchema = new mongoose.Schema({
   hourlyRate: Number,
});

export default mongoose.model('Pricing', PricingSchema);