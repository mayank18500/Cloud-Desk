import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./model/User.js";

dotenv.config();
const app=express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT=process.env.PORT || 5000;

main()
    .then(()=>{
        console.log("connected to db");

    })
    .catch((err)=>{
        console.log(err);
    })
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/Cloud-Desk");
};

app.get("/",(req,res)=>{
    res.status(200).send("Hire Hub Backend Server is Running");
});

app.post("/User",async (req,res)=>{
    try{
        const {name,email,password,role,bio,skills,pricing,portfolio}= req.body
        const newUser= new  User({name,email,password,role,bio,skills,pricing,portfolio})
        await newUser.save();
        res.status(201).json({ success: true, message: "User saved", data: newUser});
    }
    
    catch (err) {
    console.error(err);
    }
});

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});