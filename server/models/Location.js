import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  description: { type: String },
  landmark: { type: String },
  directions: { type: String }
}, { timestamps: true });

export default mongoose.model('Location', locationSchema);
