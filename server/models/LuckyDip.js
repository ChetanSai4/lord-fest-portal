import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  tickets: { type: Number, required: true, default: 1 },
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model('LuckyDip', schema);
