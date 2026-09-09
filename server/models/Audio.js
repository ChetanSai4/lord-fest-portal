import mongoose from 'mongoose';

const audioSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  gridFsFileId: { type: mongoose.Schema.Types.ObjectId, required: true },
  title: { type: String, required: true },
  artist: { type: String },
  category: { 
    type: String, 
    enum: ['Bhajan', 'Mantra', 'Aarti', 'Devotional'],
    required: true 
  },
  description: { type: String },
  contentType: { type: String, required: true },
  duration: { type: Number }, // duration in seconds
  size: { type: Number }
}, { timestamps: true });

export default mongoose.model('Audio', audioSchema);
