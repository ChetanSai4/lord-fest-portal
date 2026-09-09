import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, CheckCircle2, XCircle, Loader2, ShieldCheck, IndianRupee } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const PaymentModal = ({ isOpen, onClose, amount, onSuccess }) => {
  const [step, setStep] = useState('form'); // form, processing, success, error
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '', name: '' });

  const handleProcess = (e) => {
    e.preventDefault();
    setStep('processing');
    
    // Simulate network delay and processing
    setTimeout(() => {
      // 95% success rate simulation
      if (Math.random() > 0.05) {
        setStep('success');
        setTimeout(() => {
          onSuccess();
          onClose();
          setStep('form');
        }, 2000);
      } else {
        setStep('error');
      }
    }, 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] flex items-center justify-center bg-obsidian-950/80 backdrop-blur-md p-4"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="w-full max-w-md bg-ivory/95 rounded-3xl shadow-[0_20px_60px_rgba(223,179,108,0.2)] border border-divine-300/50 overflow-hidden relative"
          >
            {/* Header */}
            <div className="bg-obsidian-900 p-6 text-center border-b border-divine-300/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-divine-500/20 via-divine-300/20 to-divine-500/20 animate-pulse" />
              <div className="relative z-10 flex justify-center mb-3">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-divine-200 to-divine-500 flex items-center justify-center shadow-[0_0_20px_rgba(223,179,108,0.5)]">
                  <IndianRupee size={32} className="text-obsidian-900" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-divine-100 tracking-tight relative z-10">Secure Checkout</h3>
              <p className="text-divine-400 font-semibold relative z-10">{formatCurrency(amount)}</p>
            </div>

            {/* Content */}
            <div className="p-6">
              {step === 'form' && (
                <form onSubmit={handleProcess} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-obsidian-800 uppercase tracking-wider mb-1">Cardholder Name</label>
                    <input required type="text" placeholder="Ganesha Devotee" className="input-field !bg-white !text-obsidian-900 !border-slate-200" value={cardDetails.name} onChange={e => setCardDetails({...cardDetails, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-obsidian-800 uppercase tracking-wider mb-1">Card Number</label>
                    <div className="relative">
                      <CreditCard className="absolute left-4 top-3.5 text-slate-400" size={18} />
                      <input required type="text" placeholder="**** **** **** ****" maxLength="19" className="input-field !bg-white !text-obsidian-900 !border-slate-200 pl-11" value={cardDetails.number} onChange={e => setCardDetails({...cardDetails, number: e.target.value})} />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-obsidian-800 uppercase tracking-wider mb-1">Expiry</label>
                      <input required type="text" placeholder="MM/YY" maxLength="5" className="input-field !bg-white !text-obsidian-900 !border-slate-200 text-center" value={cardDetails.expiry} onChange={e => setCardDetails({...cardDetails, expiry: e.target.value})} />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-obsidian-800 uppercase tracking-wider mb-1">CVC</label>
                      <input required type="password" placeholder="***" maxLength="4" className="input-field !bg-white !text-obsidian-900 !border-slate-200 text-center" value={cardDetails.cvc} onChange={e => setCardDetails({...cardDetails, cvc: e.target.value})} />
                    </div>
                  </div>
                  
                  <div className="pt-4 flex items-center justify-between gap-4">
                    <button type="button" onClick={onClose} className="btn-secondary w-full">Cancel</button>
                    <button type="submit" className="btn-primary w-full flex items-center gap-2">
                      <ShieldCheck size={18} /> Pay {formatCurrency(amount)}
                    </button>
                  </div>
                </form>
              )}

              {step === 'processing' && (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <Loader2 size={48} className="text-divine-400 animate-spin mb-4" />
                  <h4 className="text-xl font-bold text-obsidian-900">Processing Payment...</h4>
                  <p className="text-slate-500 mt-2">Please do not close this window.</p>
                </div>
              )}

              {step === 'success' && (
                <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="py-12 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 size={40} className="text-green-600" />
                  </div>
                  <h4 className="text-2xl font-bold text-obsidian-900">Payment Successful!</h4>
                  <p className="text-slate-500 mt-2">Thank you for your generous contribution.</p>
                </motion.div>
              )}

              {step === 'error' && (
                <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="py-8 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mb-4">
                    <XCircle size={40} className="text-rose-600" />
                  </div>
                  <h4 className="text-2xl font-bold text-obsidian-900">Payment Failed</h4>
                  <p className="text-slate-500 mt-2 mb-6">Your bank declined the transaction.</p>
                  <button onClick={() => setStep('form')} className="btn-primary">Try Again</button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;
