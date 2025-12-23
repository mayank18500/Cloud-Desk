import mongoose from "mongoose";

const Schema = mongoose.Schema;

const companySchema = new Schema({
  role: {
    type: String,
    enum: ['company'],
    default: 'company',
    required: true,
  },
  name: { type: String, required: true }, // user full name
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  companyName: { type: String, required: true },
  location: { type: String, required: true },
  website: { type: String },
  hiringNeeds: { type: String, required: true},
}, { timestamps: true });

export default mongoose.model("Company", companySchema);
