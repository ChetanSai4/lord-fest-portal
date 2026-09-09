import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  description: { type: String },
  uploadDate: { type: Date, default: Date.now }
});

export default mongoose.model('Video', videoSchema);
