import mongoose from 'mongoose';

const fundSchema = new mongoose.Schema({
  contributorName: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true, default: Date.now },
  paymentMode: { 
    type: String, 
    enum: ['Cash', 'UPI', 'Bank Transfer', 'Other'],
    required: true 
  },
  purpose: { type: String },
  notes: { type: String }
}, { timestamps: true });

fundSchema.index({ date: -1 });
fundSchema.index({ contributorName: 1 });

export default mongoose.model('Fund', fundSchema);
