import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from the correct path (go up one level to root)
dotenv.config({ path: join(__dirname, '../.env') });

// Or if .env is in the same directory
// dotenv.config();

// Debug: Check if URI is loaded
console.log('📌 MONGOSE_URI:', process.env.MONGOSE_URI ? '✅ Loaded' : '❌ Not loaded');

// Your connection code
const clearUsers = async () => {
    try {
        // Make sure URI exists
        const uri = process.env.MONGOSE_URI;
        if (!uri) {
            throw new Error('MONGOSE_URI is not defined in .env file');
        }

        await mongoose.connect(uri);
        console.log('🟢 Connected to MongoDB');
        
        // Your code here...
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
};

clearUsers();