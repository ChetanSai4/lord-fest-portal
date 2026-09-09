import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let gridfsBucket;
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('Using existing MongoDB connection');
    return;
  }
  try {
    let mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.log('No MONGODB_URI provided. Starting embedded MongoDB Memory Server with persistence...');
      
      const fs = await import('fs');
      const path = await import('path');
      const dbPath = path.resolve(process.cwd(), 'server', 'data');
      if (!fs.existsSync(dbPath)) {
        fs.mkdirSync(dbPath, { recursive: true });
      }

      const mongoServer = await MongoMemoryServer.create({
        instance: {
          dbPath: dbPath,
          storageEngine: 'wiredTiger'
        }
      });
      mongoUri = mongoServer.getUri();
      console.log(`Embedded MongoDB started at ${mongoUri}`);
    }

    const conn = await mongoose.connect(mongoUri);
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Initialize GridFSBucket
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.connection.db, {
      bucketName: 'uploads'
    });
    console.log('GridFS Bucket initialized');

  } catch (error) {
    console.error(`Error: ${error.message}`);
    // Only exit in development, prevent lambda crashing in prod
    if (!process.env.VERCEL) {
      process.exit(1);
    }
  }
};

export const getGridFSBucket = () => {
  if (!gridfsBucket && isConnected) {
    gridfsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'uploads'
    });
  }
  return gridfsBucket;
};
export default connectDB;
