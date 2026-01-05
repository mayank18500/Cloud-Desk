import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../Backend/model/User.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from root
dotenv.config({ path: path.join(__dirname, '../Backend/.env') });

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        const users = await User.find({}, 'email role password');
        console.log('\n--- REGISTERED USERS ---');
        if (users.length === 0) {
            console.log('No users found in database.');
        }
        users.forEach(user => {
            console.log(`ID: ${user._id}`);
            console.log(`Email: ${user.email}`);
            console.log(`Role: ${user.role}`);
            // Only printing first few chars of hash to verify it's hashed
            console.log(`Password Hash: ${user.password ? user.password.substring(0, 10) + '...' : 'MISSING'}`);
            console.log('-------------------------');
        });
        console.log('------------------------\n');

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

connectDB();
