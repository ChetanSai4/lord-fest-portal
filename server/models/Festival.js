import mongoose from 'mongoose';

const festivalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  year: { type: String, required: true },
  description: { type: String, required: true },
  organizer: { type: String, required: true },
  committeeMembers: [{
    name: String,
    role: String,
    phone: String,
    avatar: String
  }],
  contact: { type: String, required: true },
  email: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  location: {
    name: String,
    address: String,
    latitude: Number,
    longitude: Number,
    landmark: String
  }
}, { timestamps: true });

export default mongoose.model('Festival', festivalSchema);
