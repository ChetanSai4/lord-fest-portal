import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import { autoSeed } from './seed/autoSeed.js';

import festivalRoutes from './routes/festivalRoutes.js';
import fundRoutes from './routes/fundRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import audioRoutes from './routes/audioRoutes.js';
import videoRoutes from "./routes/videoRoutes.js";
import locationRoutes from './routes/locationRoutes.js';
import authRoutes from "./routes/authRoutes.js";
import ladduRoutes from "./routes/ladduRoutes.js";
import luckyDipRoutes from "./routes/luckyDipRoutes.js";
import adminRoutes from "./routes/adminManagementRoutes.js";
import dashboardRoutes from './routes/dashboardRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Security Middlewares
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ 
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}));
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: 'Too many requests' }
});
app.use('/api', limiter);

// API Routes
app.use('/api/festival', festivalRoutes);
app.use('/api/funds', fundRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/audio', audioRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/laddu', ladduRoutes);
app.use('/api/lucky-dip', luckyDipRoutes);

// Error Handling
app.use(errorHandler);

// Connect to DB and Start Server
connectDB().then(async () => {
  await autoSeed(); // Run auto-seeder
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error('Database connection failed', err);
  process.exit(1);
});
