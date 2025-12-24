import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import interviewerRoutes from "./routes/interviewerRoutes.js"; 
import userRoutes from "./routes/userRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";

dotenv.config();

// Connect to Database
connectDB(process.env.MONGO_URL);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // Allows requests from your React frontend

// Default Route
app.get("/", (req, res) => {
    res.status(200).send("Hire Hub Backend Server is Running");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/interviewers", interviewerRoutes);
app.use("/api/users", userRoutes);       // Add this
app.use("/api/interviews", interviewRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});