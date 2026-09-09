import React, { useEffect, useState } from 'react';
import { getLuckyDip, createLuckyDip } from '../services/api';
import { useToast } from '../context/ToastContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Ticket, Gift } from 'lucide-react';
import Modal from '../components/Modal';

const LuckyDip = () => {
  const [tickets, setTickets] = useState([]);
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', tickets: 1 });
  const TICKET_PRICE = 100;

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [purchasedTickets, setPurchasedTickets] = useState(0);

  const fetchTickets = () => getLuckyDip().then(res => setTickets(res.data.data)).catch(console.error);
  useEffect(() => { fetchTickets(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createLuckyDip({ ...formData, amount: formData.tickets * TICKET_PRICE });
      setIsModalOpen(false);
      setPurchasedTickets(formData.tickets);
      setShowSuccessModal(true);
      setFormData({ name: '', phone: '', tickets: 1 });
      fetchTickets();
    } catch(err) {
      addToast('Failed to purchase tickets', 'error');
    }
  };

  return (
    <div className="space-y-8 relative z-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-200 tracking-tight flex items-center gap-3">
             <Gift className="text-rose-500"/> Lucky Dip
           </h2>
           <p className="text-slate-500 text-sm mt-1 font-medium">Buy tickets to win exciting prizes on the final day.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary py-2.5 px-6 bg-rose-500 hover:bg-rose-600 border-rose-600 shadow-[0_0_20px_rgba(244,63,94,0.3)] animate-pulse hover:animate-none">
          <Ticket size={18} className="mr-2" /> Buy Tickets
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="card p-8 bg-gradient-to-br from-rose-50 to-pink-100 dark:from-rose-900/40 dark:to-pink-900/20 border border-rose-200 dark:border-rose-800 text-center">
            <Ticket size={64} className="mx-auto text-rose-500 mb-4 drop-shadow-md" />
            <h3 className="text-4xl font-black text-rose-600 dark:text-rose-400 mb-2">₹{TICKET_PRICE}</h3>
            <p className="text-rose-700 dark:text-rose-500 font-bold uppercase tracking-widest text-sm mb-4">Per Ticket</p>
            <p className="text-slate-600 dark:text-slate-400 font-medium text-sm">Prizes include Gold Coins, Silver Idols, and Special Pooja Packages.</p>
          </div>
        </div>
        
        <div className="lg:col-span-2 card overflow-hidden">
           <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
             <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 border-b border-slate-200 dark:border-slate-700 uppercase tracking-wider text-xs">
               <tr>
                 <th className="px-6 py-4 font-bold">Participant</th>
                 <th className="px-6 py-4 font-bold">Tickets</th>
                 <th className="px-6 py-4 font-bold">Time</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
               {tickets.map(t => (
                 <tr key={t._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                   <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">{t.name}</td>
                   <td className="px-6 py-4 font-extrabold text-rose-600">{t.tickets}</td>
                   <td className="px-6 py-4 font-medium text-xs text-slate-500">{formatDate(t.createdAt)}</td>
                 </tr>
               ))}
               {tickets.length === 0 && (
                 <tr><td colSpan="3" className="px-6 py-10 text-center font-medium text-slate-400">No participants yet. Buy the first ticket!</td></tr>
               )}
             </tbody>
           </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Purchase Lucky Dip Tickets">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Your Name</label>
            <input required type="text" className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Rahul Sharma"/>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
            <input required type="text" className="input-field" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="Mobile Number"/>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Number of Tickets</label>
            <input required type="number" min="1" className="input-field" value={formData.tickets} onChange={e => setFormData({...formData, tickets: parseInt(e.target.value) || 1})} />
          </div>
          
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <span className="font-bold text-slate-600 dark:text-slate-400">Total Amount:</span>
            <span className="font-black text-2xl text-rose-600">{formatCurrency(formData.tickets * TICKET_PRICE)}</span>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-700">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary bg-rose-500 hover:bg-rose-600 border-rose-600">Buy Tickets</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} title="Purchase Successful">
        <div className="flex flex-col items-center p-4">
          <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl w-full p-6 shadow-xl relative overflow-hidden border-2 border-dashed border-rose-200">
             <div className="absolute top-1/2 -left-3 w-6 h-6 bg-white rounded-full transform -translate-y-1/2"></div>
             <div className="absolute top-1/2 -right-3 w-6 h-6 bg-white rounded-full transform -translate-y-1/2"></div>
             
             <div className="flex justify-between items-start mb-4">
               <div>
                 <h4 className="font-black text-2xl uppercase tracking-widest text-rose-100">Lucky Dip</h4>
                 <p className="text-sm font-medium text-rose-200">Admit One</p>
               </div>
               <Ticket size={40} className="text-rose-200 opacity-50" />
             </div>
             
             <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm mb-4">
               <p className="text-sm font-medium text-rose-100 mb-1">Tickets Purchased</p>
               <p className="text-4xl font-black">{purchasedTickets} <span className="text-lg font-bold">x ₹{TICKET_PRICE}</span></p>
             </div>
             
             <div className="flex justify-between text-xs font-bold text-rose-200 uppercase tracking-widest border-t border-rose-400/50 pt-3">
               <span>Save this for the draw!</span>
               <span>#LD-{Math.floor(Math.random() * 9000) + 1000}</span>
             </div>
          </div>
          <p className="text-slate-500 text-sm mt-6 text-center font-medium">Please take a screenshot of your ticket or show this screen to the committee.</p>
          <button onClick={() => setShowSuccessModal(false)} className="btn-primary bg-rose-500 hover:bg-rose-600 border-rose-600 w-full mt-4">Done</button>
        </div>
      </Modal>
    </div>
  );
};
export default LuckyDip;
