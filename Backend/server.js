import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import interviewerRoutes from "./routes/interviewerRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import path from 'path';
import { fileURLToPath } from 'url';


dotenv.config();

// Connect to Database
connectDB(process.env.MONGO_URL);

const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.static(path.join(__dirname, '../dist')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/uploads', express.static('uploads'));

// Default Route

app.get("/", (req, res) => {
    res.status(200).send("Cloud-Desk Backend Server is Running");
});

// API Routes
app.use("/api/auth", authRoutes);
//app.use("/api/interviewers", interviewerRoutes);
app.use("/api/users", userRoutes);       // Add this
app.use("/api/interviews", interviewRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/interviewer", interviewerRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/chats", chatRoutes);
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});