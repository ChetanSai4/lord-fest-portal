import { getGridFSBucket } from '../config/db.js';
import { Readable } from 'stream';
import mongoose from 'mongoose';

export const uploadToGridFS = (file) => {
  return new Promise((resolve, reject) => {
    const bucket = getGridFSBucket();
    const readableStream = new Readable();
    readableStream.push(file.buffer);
    readableStream.push(null);

    const uploadStream = bucket.openUploadStream(file.originalname, {
      contentType: file.mimetype,
    });

    readableStream.pipe(uploadStream)
      .on('error', (error) => {
        reject(error);
      })
      .on('finish', () => {
        resolve(uploadStream.id);
      });
  });
};

export const deleteFromGridFS = async (fileId) => {
  const bucket = getGridFSBucket();
  try {
    await bucket.delete(new mongoose.Types.ObjectId(fileId));
  } catch (error) {
    console.error('Error deleting from GridFS', error);
  }
};
