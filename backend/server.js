import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/connectDB.js';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';


dotenv.config();

connectDB();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json()); // To parse JSON data in the body of the request
app.use(express.urlencoded({ extended: true })); // To parse form data in the body of the request
app.use(cookieParser());

app.use('/api/users', userRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    });