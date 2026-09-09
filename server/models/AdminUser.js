import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isMainAdmin: { type: Boolean, default: false }
});

export default mongoose.model('AdminUser', adminSchema);
