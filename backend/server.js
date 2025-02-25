import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/connectDB.js';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import { v2 as cloudinary } from 'cloudinary';
import swaggerUi from "swagger-ui-express";
import fs from "fs";




dotenv.config();

connectDB();

const app = express();

const PORT = process.env.PORT || 5000;


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

app.use(express.json({limit : "50mb"})); // To parse JSON data in the body of the request
app.use(express.urlencoded({limit:"50mb",extended: true })); // To parse form data in the body of the request
app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/messages', messageRoutes);

// Load Swagger JSON
const swaggerFile = JSON.parse(fs.readFileSync("./swagger-output.json", "utf-8"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile, {
    swaggerOptions: {
        authAction: {
            bearerAuth: {
                name: "Authorization",
                schema: { type: "apiKey", in: "header", name: "Authorization" },
                value: "Bearer YOUR_ACCESS_TOKEN", // You can replace it dynamically in the UI
                },
        },
    },
}));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
    });