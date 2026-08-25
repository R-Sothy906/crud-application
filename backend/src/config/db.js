// Import mongoose library for MongoDB connection
import mongoose from 'mongoose'; 

// Function to connect to MongoDB database
export const connectDB = async()=> {
    try {
        // Try to connect using the connection string from environment variables
        const conn = await mongoose.connect(process.env.MONGOSE_URI);
        // Log success message if connection is established
        console.log(`🟢 Mongoose connect successfully`)
    } catch {
        // Log error message if connection fails
        console.log(`🔴 Mongoose connection error!`)
    }
}