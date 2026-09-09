import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model('LadduBid', schema);
