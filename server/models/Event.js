import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  startTime: { type: String, required: true }, // e.g. "09:00 AM"
  endTime: { type: String, required: true }, // e.g. "12:00 PM"
  venue: { type: String, required: true },
  eventType: { 
    type: String, 
    enum: ['Pooja', 'Bhajan', 'Cultural Program', 'Annadanam', 'Procession', 'Visarjan'],
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'],
    default: 'Upcoming'
  }
}, { timestamps: true });

eventSchema.index({ date: 1 });

export default mongoose.model('Event', eventSchema);
