import mongoose from 'mongoose';
import Festival from './models/Festival.js';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect('mongodb://127.0.0.1:27017/festival', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
}).catch(() => {});

// We don't know the exact port of the memory server!
// Let's just modify autoSeed.js to ALWAYS update the Festival if it exists, similar to how I did Location!
