import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import Admin from '../models/Admin';
import connectDB from '../config/db';

dotenv.config();

const initAdmin = async () => {
    console.log('Starting admin initialization...');
    try {
        console.log('Connecting to database...');
        if (!process.env.MONGO_URI) {
            console.log('MONGO_URI not found in env, using fallback');
            await mongoose.connect('mongodb://localhost:27017/oms');
        } else {
            await connectDB();
        }
        console.log('Database connected.');

        const adminExists = await Admin.findOne({ email: 'admin@shop.com' });
        if (adminExists) {
            console.log('Admin already exists');
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        await Admin.create({
            email: 'admin@shop.com',
            password: hashedPassword,
        });

        console.log('Admin user created successfully');
        process.exit(0);
    } catch (error) {
        console.error(`Error: ${error}`);
        process.exit(1);
    }
};

initAdmin();
