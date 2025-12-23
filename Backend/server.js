import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./model/User.js";
import MongoStore from "connect-mongo";

dotenv.config();
const app=express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT=process.env.PORT || 5000;
const dbUrl= process.env.MONGO_URL;


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
})

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE",err);
})


main()
    .then(()=>{
        console.log("connected to db");

    })
    .catch((err)=>{
        console.log(err);
    })
async function main(){
    await mongoose.connect(dbUrl);
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