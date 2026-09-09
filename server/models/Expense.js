import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { 
    type: String, 
    enum: [
      'Decoration & Mandapam', 
      'Idol & Pooja Items', 
      'Prasadam & Annadanam', 
      'Sound & Lighting', 
      'Procession & Music', 
      'Priest & Rituals', 
      'Miscellaneous'
    ],
    required: true 
  },
  amount: { type: Number, required: true },
  date: { type: Date, required: true, default: Date.now },
  paidTo: { type: String, required: true },
  paymentMode: { 
    type: String, 
    enum: ['Cash', 'UPI', 'Bank Transfer', 'Other'],
    required: true 
  },
  description: { type: String }
}, { timestamps: true });

expenseSchema.index({ date: -1 });

export default mongoose.model('Expense', expenseSchema);
