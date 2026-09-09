import React, { useEffect, useState } from 'react';
import { getLadduBids, createLadduBid } from '../services/api';
import { useToast } from '../context/ToastContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Trophy, ArrowUpCircle } from 'lucide-react';
import Modal from '../components/Modal';

const LadduAuction = () => {
  const [bids, setBids] = useState([]);
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', amount: '' });

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const fetchBids = () => getLadduBids().then(res => setBids(res.data.data)).catch(console.error);
  useEffect(() => { fetchBids(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(bids.length > 0 && Number(formData.amount) <= bids[0].amount) {
       return addToast('Your bid must be higher than the current highest bid!', 'error');
    }
    try {
      await createLadduBid(formData);
      setIsModalOpen(false);
      setShowSuccessModal(true);
      setFormData({ name: '', phone: '', amount: '' });
      fetchBids();
    } catch(err) {
      addToast('Failed to place bid', 'error');
    }
  };

  return (
    <div className="space-y-8 relative z-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-200 tracking-tight flex items-center gap-3">
             <Trophy className="text-amber-500"/> Laddu Auction
           </h2>
           <p className="text-slate-500 text-sm mt-1 font-medium">Bid for the sacred Balapur-style Ganesh Laddu.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary py-2.5 px-6 animate-pulse hover:animate-none bg-amber-500 hover:bg-amber-600 border-amber-600 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
          <ArrowUpCircle size={18} className="mr-2" /> Place New Bid
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="card p-8 bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 text-center">
            <Trophy size={64} className="mx-auto text-amber-500 mb-4 drop-shadow-md" />
            <p className="text-amber-700 dark:text-amber-500 font-bold uppercase tracking-widest text-sm mb-2">Current Highest Bid</p>
            <h3 className="text-5xl font-black text-amber-600 dark:text-amber-400">
              {bids.length > 0 ? formatCurrency(bids[0].amount) : '₹0'}
            </h3>
            {bids.length > 0 && <p className="text-slate-600 dark:text-slate-400 font-bold mt-4">by {bids[0].name}</p>}
          </div>
        </div>
        
        <div className="lg:col-span-2 card overflow-hidden">
           <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
             <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 border-b border-slate-200 dark:border-slate-700 uppercase tracking-wider text-xs">
               <tr>
                 <th className="px-6 py-4 font-bold">Bidder Name</th>
                 <th className="px-6 py-4 font-bold">Amount</th>
                 <th className="px-6 py-4 font-bold">Time</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
               {bids.map((bid, i) => (
                 <tr key={bid._id} className={i === 0 ? 'bg-amber-50 dark:bg-amber-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}>
                   <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                     {i === 0 && <Trophy size={16} className="text-amber-500" />} {bid.name}
                   </td>
                   <td className={`px-6 py-4 font-extrabold text-base ${i===0 ? 'text-amber-600' : 'text-slate-700 dark:text-slate-300'}`}>{formatCurrency(bid.amount)}</td>
                   <td className="px-6 py-4 font-medium text-xs text-slate-500">{formatDate(bid.createdAt)}</td>
                 </tr>
               ))}
               {bids.length === 0 && (
                 <tr><td colSpan="3" className="px-6 py-10 text-center font-medium text-slate-400">No bids placed yet. Be the first!</td></tr>
               )}
             </tbody>
           </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Place Your Bid">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Your Name</label>
            <input required type="text" className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Anil Reddy"/>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
            <input required type="text" className="input-field" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="Mobile Number"/>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Bid Amount (INR)</label>
            <input required type="number" min={bids.length > 0 ? bids[0].amount + 1 : 1000} className="input-field font-mono text-xl text-amber-600 font-bold" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} placeholder="₹" />
            <p className="text-xs text-slate-500 mt-2">Must be greater than {bids.length > 0 ? formatCurrency(bids[0].amount) : '₹1000'}</p>
          </div>
          <div className="pt-6 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-700">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary bg-amber-500 hover:bg-amber-600 border-amber-600">Confirm Bid</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} title="New Highest Bidder!">
        <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
          <div className="text-6xl animate-bounce">🎉</div>
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.6)]">
             <img src="/hero-backdrop.jpg" className="w-full h-full object-cover" alt="Laddu" />
          </div>
          <h4 className="text-3xl font-black text-amber-600 tracking-tight">Bid Accepted!</h4>
          <p className="text-slate-500 font-medium">May Lord Ganesha shower you with immense blessings and prosperity.</p>
          <button onClick={() => setShowSuccessModal(false)} className="btn-primary bg-amber-500 hover:bg-amber-600 border-amber-600 w-full mt-4">Close</button>
        </div>
      </Modal>
    </div>
  );
};
export default LadduAuction;
