import express from "express";
import dotenv from "dotenv";


dotenv.config();
const app=express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT=process.env.PORT || 5000;

app.get("/",(req,res)=>{
    res.status(200).send("Hire Hub Backend Server is Running");
});

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});