import React, { useState, useEffect } from 'react';
import { getExpenses, createExpense, updateExpense, deleteExpense } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { IndianRupee, Edit2, Trash2, Tag, User, FileText, FileSpreadsheet } from 'lucide-react';
import Modal from '../components/Modal';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({ title: '', category: 'Decoration & Mandapam', amount: '', paidTo: '', paymentMode: 'UPI' });
  const { isAdmin } = useAuth();
  const { addToast } = useToast();

  const fetchExpenses = () => getExpenses().then(res => setExpenses(res.data.data.expenses || []));
  useEffect(() => { fetchExpenses(); }, []);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = { ...formData, amount: Number(formData.amount) };
      if (isEditMode) {
        await updateExpense(editingId, dataToSubmit);
        addToast('Expense updated successfully', 'success');
      } else {
        await createExpense(dataToSubmit);
        addToast('Expense recorded successfully', 'success');
      }
      setIsModalOpen(false);
      fetchExpenses();
    } catch (err) {
      addToast(isEditMode ? 'Error updating expense' : 'Error recording expense', 'error');
    }
  };

  const handleEditClick = (expense) => {
    setIsEditMode(true);
    setEditingId(expense._id);
    setFormData({
      title: expense.title,
      category: expense.category,
      amount: expense.amount,
      paidTo: expense.paidTo,
      paymentMode: expense.paymentMode || 'UPI'
    });
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setIsEditMode(false);
    setEditingId(null);
    setFormData({ title: '', category: 'Decoration & Mandapam', amount: '', paidTo: '', paymentMode: 'UPI' });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if(confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense(id);
        addToast('Expense deleted', 'info');
        fetchExpenses();
      } catch (err) {
        addToast('Error deleting expense', 'error');
      }
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Expenses & Outflows", 14, 15);
    const tableColumn = ["Title", "Category", "Amount (INR)", "Paid To", "Date", "Mode"];
    const tableRows = [];
    
    expenses.forEach(exp => {
      const expData = [
        exp.title,
        exp.category,
        exp.amount,
        exp.paidTo,
        exp.date ? new Date(exp.date).toLocaleDateString() : '-',
        exp.paymentMode || 'UPI'
      ];
      tableRows.push(expData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save("Expenses.pdf");
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(expenses.map(e => ({
      Title: e.title,
      Category: e.category,
      'Amount (INR)': e.amount,
      'Paid To': e.paidTo,
      Date: e.date ? new Date(e.date).toLocaleDateString() : '-',
      Mode: e.paymentMode || 'UPI'
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");
    XLSX.writeFile(workbook, "Expenses.xlsx");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 relative z-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
           <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400 dark:from-red-400 dark:to-white drop-shadow-[0_0_10px_rgba(239,68,68,0.5)] tracking-tighter uppercase">Expenses</h2>
           <p className="text-red-700/60 dark:text-red-200/60 text-sm mt-1 font-bold uppercase tracking-widest">Outflow & Expenditures</p>
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
          {isAdmin && (
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleAddClick} className="btn-primary py-2.5 px-6">
              Log Expense
            </motion.button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div whileHover={{ scale: 1.02 }} className="card p-8 col-span-1 md:col-span-3 bg-gradient-to-br from-red-500/10 to-transparent border-red-500/30">
          <p className="text-red-700/80 dark:text-red-200/80 font-bold uppercase tracking-widest text-sm mb-2">Total Expenses</p>
          <div className="flex items-end gap-2">
            <span className="text-5xl md:text-7xl font-black text-red-900 dark:text-white drop-shadow-[0_0_20px_rgba(239,68,68,0.8)] flex items-center">
              <IndianRupee className="mr-2" size={48} />
              {(totalExpenses || 0).toLocaleString()}
            </span>
          </div>
        </motion.div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-red-50 dark:bg-black/60 border-b border-red-200 dark:border-white/10 text-red-800 dark:text-red-300 uppercase tracking-widest text-xs font-black">
                <th className="p-5">Title</th>
                <th className="p-5">Category</th>
                <th className="p-5">Amount</th>
                <th className="p-5">Paid To</th>
                <th className="p-5">Date</th>
                {isAdmin && <th className="p-5 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-red-100 dark:divide-white/5">
              {expenses.map((expense, i) => (
                <motion.tr 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={expense._id} 
                  className="hover:bg-red-50/50 dark:hover:bg-white/5 transition-colors group"
                >
                  <td className="p-5 font-bold text-slate-800 dark:text-white">{expense.title}</td>
                  <td className="p-5">
                     <span className="px-3 py-1 bg-red-100 dark:bg-white/10 text-red-700 dark:text-red-200 rounded-lg text-xs font-bold uppercase tracking-wider border border-red-200 dark:border-white/5 flex items-center w-max gap-1"><Tag size={12}/>{expense.category}</span>
                  </td>
                  <td className="p-5 font-mono font-bold text-red-600 dark:text-red-400">₹{(expense.amount || 0).toLocaleString()}</td>
                  <td className="p-5 text-slate-600 dark:text-slate-300 flex items-center gap-2"><User size={14} className="text-slate-500"/>{expense.paidTo}</td>
                  <td className="p-5 text-slate-500 dark:text-slate-400 text-sm">{expense.date ? new Date(expense.date).toLocaleDateString() : '-'}</td>
                  {isAdmin && (
                    <td className="p-5 text-right">
                      <div className="flex justify-end gap-2 transition-opacity">
                        <button onClick={() => handleEditClick(expense)} className="p-2 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 bg-slate-100 dark:bg-white/5 rounded-lg"><Edit2 size={16}/></button>
                        <button onClick={() => handleDelete(expense._id)} className="p-2 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 bg-slate-100 dark:bg-white/5 rounded-lg"><Trash2 size={16}/></button>
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))}
              {expenses.length === 0 && (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} className="p-8 text-center text-slate-500 font-bold">No records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditMode ? "Edit Expense" : "Log Expense"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-red-300 mb-2">Expense Title</label>
            <input required className="input-field" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-red-600 dark:text-red-300 mb-2">Category</label>
              <select className="input-field" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                <option>Decoration & Mandapam</option>
                <option>Idol & Pooja Items</option>
                <option>Prasadam & Annadanam</option>
                <option>Sound & Lighting</option>
                <option>Procession & Music</option>
                <option>Priest & Rituals</option>
                <option>Miscellaneous</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-red-600 dark:text-red-300 mb-2">Amount</label>
              <input required type="number" className="input-field font-mono text-xl" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-red-600 dark:text-red-300 mb-2">Paid To</label>
              <input required className="input-field" value={formData.paidTo} onChange={e => setFormData({...formData, paidTo: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-red-600 dark:text-red-300 mb-2">Payment Mode</label>
              <select className="input-field" value={formData.paymentMode} onChange={e => setFormData({...formData, paymentMode: e.target.value})}>
                <option>UPI</option>
                <option>Cash</option>
                <option>Bank Transfer</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          <div className="pt-4 flex justify-end">
            <button type="submit" className="btn-primary w-full shadow-[0_0_20px_rgba(239,68,68,0.6)] from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500">{isEditMode ? "Update Expense" : "Log Expense"}</button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default Expenses;
