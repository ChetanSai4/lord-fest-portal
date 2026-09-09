import React, { useEffect, useState } from 'react';
import { getFunds, createFund, updateFund, deleteFund } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Search, Plus, QrCode, CreditCard, Landmark, IndianRupee, CheckCircle2, Loader2, XCircle, FileText, FileSpreadsheet, Edit, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import Modal from '../components/Modal';

const Funds = () => {
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { isAdmin } = useAuth();
  const { addToast } = useToast();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1); // 1: Details, 2: Payment Method, 3: Bank/QR Details, 4: Processing, 5: Success
  const [formData, setFormData] = useState({ 
    contributorName: '', 
    amount: '', 
    paymentMode: 'UPI', 
    purpose: 'General Fund',
    bank: 'State Bank of India'
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({ contributorName: '', amount: '', paymentMode: '', purpose: '', date: '' });

  const fetchFunds = () => {
    getFunds().then(res => {
      setFunds(res.data.data.funds);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchFunds();
  }, []);

  const handleEditClick = (fund) => {
    setEditingId(fund._id);
    setEditFormData({ 
      contributorName: fund.contributorName, 
      amount: fund.amount, 
      paymentMode: fund.paymentMode, 
      purpose: fund.purpose
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...editFormData,
        amount: Number(editFormData.amount)
      };
      await updateFund(editingId, dataToSubmit);
      addToast('Donation updated successfully', 'success');
      setIsEditModalOpen(false);
      fetchFunds();
    } catch (err) {
      console.error(err);
      addToast('Error updating donation', 'error');
    }
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this donation?")) {
      try {
        await deleteFund(id);
        addToast('Donation deleted successfully', 'success');
        fetchFunds();
      } catch (err) {
        console.error(err);
        addToast('Error deleting donation', 'error');
      }
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Donations & Funds", 14, 15);
    const tableColumn = ["Contributor", "Amount (INR)", "Date", "Mode", "Purpose"];
    const tableRows = [];
    
    funds.forEach(fund => {
      const fundData = [
        fund.contributorName,
        fund.amount,
        formatDate(fund.date),
        fund.paymentMode,
        fund.purpose
      ];
      tableRows.push(fundData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save("Funds.pdf");
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(funds.map(f => ({
      Contributor: f.contributorName,
      'Amount (INR)': f.amount,
      Date: formatDate(f.date),
      Mode: f.paymentMode,
      Purpose: f.purpose
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Funds");
    XLSX.writeFile(workbook, "Funds.xlsx");
  };

  const processPayment = () => {
    setStep(4);
    setTimeout(async () => {
      try {
        await createFund({
          contributorName: formData.contributorName,
          amount: Number(formData.amount),
          paymentMode: formData.paymentMode,
          purpose: formData.purpose,
        });
        setStep(5);
        fetchFunds();
        addToast('Payment recorded successfully!', 'success');
      } catch (err) {
        console.error(err);
        addToast('Failed to record payment on server.', 'error');
        setStep(1); 
      }
    }, 2500);
  };

  const _handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if(step === 1) {
      setStep(2);
      return;
    }
    
    if(step === 2) {
       if (formData.paymentMode === 'UPI' || formData.paymentMode === 'Bank Transfer') {
          setStep(3);
       } else {
          processPayment();
       }
       return;
    }
    
    if(step === 3) {
      processPayment();
      return;
    }
  };

  const resetModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setStep(1);
      setFormData({ contributorName: '', amount: '', paymentMode: 'UPI', purpose: 'General Fund', bank: 'State Bank of India' });
    }, 300);
  };

  const filteredFunds = funds.filter(f => 
    f.contributorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.paymentMode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.purpose.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 relative z-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h2 className="text-3xl font-extrabold text-divine-900 dark:text-divine-100 tracking-tight">Donations & Funds</h2>
           <p className="text-divine-600 dark:text-divine-300 text-sm mt-1 font-medium">Record and track all contributions.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {isAdmin && (
            <>
              <button onClick={exportToPDF} className="btn-secondary py-2.5 px-4 flex items-center justify-center" title="Download PDF">
                <FileText size={18} className="mr-2" /> PDF
              </button>
              <button onClick={exportToExcel} className="btn-secondary py-2.5 px-4 flex items-center justify-center" title="Download Excel">
                <FileSpreadsheet size={18} className="mr-2" /> Excel
              </button>
            </>
          )}
          <button onClick={() => setIsModalOpen(true)} className="btn-primary py-2.5 px-6 group flex items-center justify-center">
            <Plus size={18} className="mr-2 group-hover:rotate-90 transition-transform" /> {isAdmin ? 'Add Entry' : 'Donate Now'}
          </button>
        </div>
      </div>

      <div className="card overflow-hidden bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-none shadow-2xl">
        <div className="p-4 sm:p-6 border-b border-divine-300/30 bg-ivory/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
           <div className="relative w-full sm:w-96">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
             <input 
               type="text" 
               placeholder="Search by name, mode, or purpose..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="input-field pl-10 !bg-white dark:!bg-slate-800 !border-slate-200 dark:!border-slate-700 !text-slate-900 dark:!text-slate-100 w-full"
             />
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-divine-100/50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase tracking-wider text-xs border-b border-divine-300/30 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 font-bold">Contributor</th>
                <th className="px-6 py-4 font-bold">Amount</th>
                <th className="px-6 py-4 font-bold">Date</th>
                <th className="px-6 py-4 font-bold">Mode</th>
                {isAdmin && <th className="px-6 py-4 font-bold text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-divine-300/30">
              {filteredFunds.map((fund) => (
                <tr key={fund._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">{fund.contributorName}</td>
                  <td className="px-6 py-4 text-emerald-700 font-extrabold text-base">{formatCurrency(fund.amount)}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-medium">{formatDate(fund.date)}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-divine-100 dark:bg-slate-800 text-divine-800 dark:text-divine-300 rounded-lg text-xs font-bold tracking-wide border border-divine-300 dark:border-slate-700 shadow-sm">
                      {fund.paymentMode}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEditClick(fund)} className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-divine-600 rounded-lg transition-colors" title="Edit">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDeleteClick(fund._id)} className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-red-600 rounded-lg transition-colors" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {filteredFunds.length === 0 && !loading && (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-500 font-medium">
                    No donations found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-obsidian-950/80 backdrop-blur-md p-4 sm:p-6"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row min-h-[500px]"
            >
              {/* Left Pane - Brand & Summary */}
              <div className="md:w-1/3 bg-gradient-to-b from-indigo-600 to-violet-800 p-6 md:p-8 text-white flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-8">
                     <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm font-bold text-xl">L</div>
                     <span className="font-bold text-lg">Lord Fest</span>
                  </div>
                  
                  {step === 1 ? (
                    <div className="space-y-4">
                      <p className="text-white/70 text-sm font-semibold uppercase tracking-wider mb-2">Donation Details</p>
                      <div>
                        <label className="block text-xs text-indigo-200 mb-1">Name</label>
                        <input required type="text" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/50" value={formData.contributorName} onChange={e => setFormData({...formData, contributorName: e.target.value})} placeholder="Your Name"/>
                      </div>
                      <div>
                        <label className="block text-xs text-indigo-200 mb-1">Amount</label>
                        <input required type="number" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 text-xl font-bold" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} placeholder="₹" />
                      </div>
                      <div>
                        <label className="block text-xs text-indigo-200 mb-1">Purpose</label>
                        <select className="w-full bg-indigo-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/50 [&>option]:bg-indigo-900" value={formData.purpose} onChange={e => setFormData({...formData, purpose: e.target.value})}>
                          <option>General Fund</option>
                          <option>Annadanam</option>
                          <option>Laddu Auction</option>
                          <option>Pooja Materials</option>
                        </select>
                      </div>
                      <button onClick={() => {if(formData.contributorName && formData.amount) setStep(2)}} className="w-full bg-white text-indigo-700 font-bold py-3 rounded-xl mt-4 hover:bg-indigo-50 transition-colors">Continue to Pay</button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-white/70 text-sm font-semibold mb-1">Price Summary</p>
                      <h3 className="text-4xl font-bold mb-6">{formatCurrency(formData.amount || 0)}</h3>
                      
                      <div className="bg-black/20 p-4 rounded-xl space-y-2 border border-white/10">
                         <p className="text-sm flex justify-between"><span className="text-indigo-200">Name</span> <span className="font-medium truncate max-w-[120px]">{formData.contributorName}</span></p>
                         <p className="text-sm flex justify-between"><span className="text-indigo-200">Purpose</span> <span className="font-medium truncate max-w-[120px]">{formData.purpose}</span></p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-8">
                  <p className="text-xs text-indigo-300 flex items-center gap-1 opacity-70"><CheckCircle2 size={12}/> Secured by LordFest</p>
                </div>
              </div>

              {/* Right Pane - Payment Details */}
              <div className="md:w-2/3 bg-slate-50 dark:bg-slate-900 p-0 flex flex-col relative">
                {/* Header */}
                <div className="p-4 md:p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 z-10">
                   <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{step === 1 ? 'Enter Details First' : 'Payment Options'}</h3>
                   <button onClick={resetModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><XCircle size={24}/></button>
                </div>

                {step === 1 && (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500">
                     <CreditCard size={48} className="opacity-20 mb-4"/>
                     <p>Please enter your details and amount on the left to proceed with payment.</p>
                  </div>
                )}

                {step >= 2 && step <= 4 && (
                  <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                     {/* Options Sidebar */}
                     <div className="w-full md:w-5/12 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-3 space-y-2 overflow-y-auto">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest px-3 pt-2 mb-2">Preferred</div>
                        
                        <button onClick={() => setFormData({...formData, paymentMode: 'UPI'})} className={`w-full flex flex-col items-start p-3 rounded-xl transition-colors ${formData.paymentMode === 'UPI' ? 'bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400' : 'hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent text-slate-700 dark:text-slate-300'}`}>
                           <div className="flex items-center gap-3 w-full">
                             <div className={`p-2 rounded-lg ${formData.paymentMode === 'UPI' ? 'bg-indigo-100 dark:bg-indigo-900' : 'bg-slate-100 dark:bg-slate-800'}`}><QrCode size={18}/></div>
                             <div className="text-left"><p className="text-sm font-bold">UPI</p><p className="text-xs opacity-70">Google Pay, PhonePe, Paytm</p></div>
                           </div>
                        </button>
                        
                        <button onClick={() => setFormData({...formData, paymentMode: 'Bank Transfer'})} className={`w-full flex flex-col items-start p-3 rounded-xl transition-colors ${formData.paymentMode === 'Bank Transfer' ? 'bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400' : 'hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent text-slate-700 dark:text-slate-300'}`}>
                           <div className="flex items-center gap-3 w-full">
                             <div className={`p-2 rounded-lg ${formData.paymentMode === 'Bank Transfer' ? 'bg-indigo-100 dark:bg-indigo-900' : 'bg-slate-100 dark:bg-slate-800'}`}><Landmark size={18}/></div>
                             <div className="text-left"><p className="text-sm font-bold">Bank Transfer</p><p className="text-xs opacity-70">IMPS, NEFT, RTGS</p></div>
                           </div>
                        </button>

                        {(isAdmin) && (
                          <button onClick={() => setFormData({...formData, paymentMode: 'Cash'})} className={`w-full flex flex-col items-start p-3 rounded-xl transition-colors ${formData.paymentMode === 'Cash' ? 'bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400' : 'hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent text-slate-700 dark:text-slate-300'}`}>
                             <div className="flex items-center gap-3 w-full">
                               <div className={`p-2 rounded-lg ${formData.paymentMode === 'Cash' ? 'bg-indigo-100 dark:bg-indigo-900' : 'bg-slate-100 dark:bg-slate-800'}`}><IndianRupee size={18}/></div>
                               <div className="text-left"><p className="text-sm font-bold">Cash</p><p className="text-xs opacity-70">Manual admin entry</p></div>
                             </div>
                          </button>
                        )}
                     </div>

                     {/* Right Action Area */}
                     <div className="w-full md:w-7/12 p-6 flex flex-col">
                        {step === 4 ? (
                          <div className="flex-1 flex flex-col items-center justify-center text-center">
                            <Loader2 size={48} className="text-indigo-500 animate-spin mb-4" />
                            <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200">Verifying Payment...</h4>
                            <p className="text-slate-500 text-sm mt-2">Please wait.</p>
                          </div>
                        ) : formData.paymentMode === 'UPI' ? (
                          <div className="flex-1 flex flex-col h-full space-y-4">
                             <h4 className="font-bold text-slate-800 dark:text-slate-200">Scan QR Code</h4>
                             <div className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm mb-4 inline-block">
                                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=7981418433@ybl&pn=SriVinayakaSangham&am=${formData.amount}&cu=INR`} alt="UPI QR Code" className="w-32 h-32 object-contain" />
                                </div>
                                <p className="text-xs text-slate-500">Scan with any UPI App</p>
                                <div className="flex gap-2 mt-4 opacity-70 grayscale">
                                   <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center font-bold text-xs text-black">GPay</div>
                                   <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center font-bold text-xs text-black">PhPe</div>
                                   <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center font-bold text-xs text-black">Paytm</div>
                                </div>
                             </div>
                             <button onClick={processPayment} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md transition-colors">I have paid {formatCurrency(formData.amount)}</button>
                          </div>
                        ) : formData.paymentMode === 'Bank Transfer' ? (
                          <div className="flex-1 flex flex-col h-full space-y-4">
                             <h4 className="font-bold text-slate-800 dark:text-slate-200">Bank Details</h4>
                             <div className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-col justify-center space-y-3">
                                <div>
                                   <p className="text-xs text-slate-500 uppercase">Account Name</p>
                                   <p className="font-bold text-slate-800 dark:text-slate-200">Sri Vinayaka Yuvajana Sangham</p>
                                </div>
                                <div>
                                   <p className="text-xs text-slate-500 uppercase">Account Number</p>
                                   <p className="font-mono font-bold text-slate-800 dark:text-slate-200">123456789012</p>
                                </div>
                                <div>
                                   <p className="text-xs text-slate-500 uppercase">IFSC Code</p>
                                   <p className="font-mono font-bold text-slate-800 dark:text-slate-200">SBIN0001234</p>
                                </div>
                             </div>
                             <button onClick={processPayment} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md transition-colors">Confirm Transfer</button>
                          </div>
                        ) : (
                          <div className="flex-1 flex flex-col h-full space-y-4">
                             <h4 className="font-bold text-slate-800 dark:text-slate-200">Cash Payment</h4>
                             <div className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center text-center">
                                <IndianRupee size={48} className="text-slate-300 mb-4"/>
                                <p className="text-slate-500 text-sm">Record a manual cash payment received from the contributor.</p>
                             </div>
                             <button onClick={processPayment} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md transition-colors">Record Cash Entry</button>
                          </div>
                        )}
                     </div>
                  </div>
                )}

                {step === 5 && (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-slate-900">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                      <CheckCircle2 size={40} className="text-green-600 dark:text-green-400" />
                    </div>
                    <h4 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight mb-2">Payment Successful!</h4>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm">Thank you, <span className="font-bold text-slate-800 dark:text-slate-200">{formData.contributorName}</span>. Your contribution of {formatCurrency(formData.amount)} is received.</p>
                    <button type="button" onClick={resetModal} className="w-full sm:w-auto px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold transition-colors">Download Receipt & Close</button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Donation">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-saffron-300 mb-2">Contributor Name</label>
            <input required className="input-field" value={editFormData.contributorName} onChange={e => setEditFormData({...editFormData, contributorName: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-saffron-300 mb-2">Amount</label>
              <input required type="number" className="input-field font-mono text-xl" value={editFormData.amount} onChange={e => setEditFormData({...editFormData, amount: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-saffron-300 mb-2">Payment Mode</label>
              <select className="input-field" value={editFormData.paymentMode} onChange={e => setEditFormData({...editFormData, paymentMode: e.target.value})}>
                <option>Cash</option>
                <option>UPI</option>
                <option>Bank Transfer</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-saffron-300 mb-2">Purpose</label>
            <select className="input-field" value={editFormData.purpose} onChange={e => setEditFormData({...editFormData, purpose: e.target.value})}>
              <option>General Fund</option>
              <option>Annadanam</option>
              <option>Laddu Auction</option>
              <option>Pooja Materials</option>
            </select>
          </div>
          <div className="pt-6 flex justify-end gap-3 border-t border-slate-700/50">
            <button type="button" onClick={() => setIsEditModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary shadow-[0_0_15px_rgba(223,179,108,0.4)]">Update Donation</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Funds;
