import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  filename: { type: String, required: true },
  gridFsFileId: { type: mongoose.Schema.Types.ObjectId, required: true },
  contentType: { type: String, required: true },
  eventDate: { type: Date, default: Date.now },
  caption: { type: String },
  description: { type: String },
  size: { type: Number }
}, { timestamps: true });

gallerySchema.index({ eventDate: -1 });

export default mongoose.model('Gallery', gallerySchema);
