import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configure CORS from environment variable `CORS_ORIGIN` (comma-separated list)
const allowedOrigins = [
    process.env.CORS_ORIGIN, // Add your Vercel frontend URL in environment variables
    'http://localhost:3000',
    'http://localhost:5173', // Your deployed frontend
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));


import userRoutes from './routes/userRoutes.js';
import farmerRoutes from './routes/farmerRoutes.js';
import fieldRoutes from './routes/fieldRoutes.js';
import sensorRoutes from './routes/sensorRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import irrigationRoutes from './routes/irrigationRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import weatherRoutes from './routes/weatherRoutes.js';


// Routes
app.use('/api/users', userRoutes);
app.use('/api/farmers', farmerRoutes);
app.use('/api/fields', fieldRoutes);
app.use('/api/sensors', sensorRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/irrigation', irrigationRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/weather', weatherRoutes);

// Make uploads folder static
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.get('/', (req, res) => {
    res.send('API is running...');
});

import errorHandler from './middleware/errorMiddleware.js';
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
