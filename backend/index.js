import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import 'dotenv/config'
import {connectDB} from './src/config/db.js'
import route from './src/routes/index.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';


connectDB(); 
const app = express();
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL (Vite default)
  credentials: true, // Allow cookies if needed
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// route maping 
app.use(route);
app.get("/", (req, res) => {
    res.send("Hello World!");
})

app.listen(process.env.PORT || 3000, () => {
    console.log(`▶️ :Server is running on port ${process.env.PORT || 3000}`);
    console.log(`✅ : http://localhost:${process.env.PORT || 3000}`);
})