// // Import mongoose library for MongoDB connection
// import mongoose from 'mongoose'; 

// // Function to connect to MongoDB database
// export const connectDB = async()=> {
//     try {
//         // Try to connect using the connection string from environment variables
//         const conn = await mongoose.connect(process.env.MONGOSE_URI);
//         // Log success message if connection is established
//         console.log(`🟢 Mongoose connect successfully`)
//     } catch {
//         // Log error message if connection fails
//         console.log(`🔴 Mongoose connection error!`)
//     }
// }



import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGOSE_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);

    setTimeout(connectDB, 5000);
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('🔄 MongoDB reconnected');
});

export default connectDB;