import React, { useEffect, useState } from 'react';
import { getAdmins, createAdmin, deleteAdmin, API_BASE_URL } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Shield, Plus, Trash2, UserCog, User } from 'lucide-react';
import Modal from '../components/Modal';

const AdminUsers = () => {
  const [admins, setAdmins] = useState([]);
  const { isMainAdmin, user } = useAuth();
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });

  const fetchAdmins = () => getAdmins().then(res => setAdmins(res.data.data)).catch(console.error);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createAdmin(formData);
      addToast('New admin added successfully', 'success');
      setIsModalOpen(false);
      setFormData({ username: '', password: '' });
      fetchAdmins();
    } catch (err) {
      addToast(err.response?.data?.message || 'Error creating admin', 'error');
    }
  };

  const handleDelete = async (id, isMain) => {
    if (isMain) return addToast('Cannot delete Main Admin', 'error');
    if (!confirm('Revoke access for this admin?')) return;
    try {
      await deleteAdmin(id);
      addToast('Admin access revoked', 'info');
      fetchAdmins();
    } catch (err) {
      addToast('Delete failed', 'error');
    }
  };

  if (!isMainAdmin) {
    return <div className="p-10 text-center text-rose-500 font-bold">Access Denied. Only the Main Admin can view this page.</div>;
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto relative z-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-200 tracking-tight flex items-center gap-3">
             <UserCog className="text-saffron-500"/> Manage Admins
           </h2>
           <p className="text-slate-500 text-sm mt-1 font-medium">Add or remove sub-admin access.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => window.open(`${API_BASE_URL}/dashboard/export?token=` + localStorage.getItem('token'), '_blank')} className="btn-secondary py-2.5 px-6 border-blue-500 text-blue-600 dark:border-blue-700 dark:text-blue-400">
            Export JSON Data
          </button>
          <button onClick={() => setIsModalOpen(true)} className="btn-primary py-2.5 px-6">
            <Plus size={18} className="mr-2" /> Add Sub-Admin
          </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {admins.map(admin => (
            <div key={admin._id} className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm border ${admin.isMainAdmin ? 'bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-900/30 dark:border-emerald-700' : 'bg-slate-100 border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-700'}`}>
                  {admin.isMainAdmin ? <Shield size={24} /> : <User size={24} />}
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-200">{admin.username} {admin.username === user.username && '(You)'}</h3>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded mt-1 inline-block uppercase tracking-widest ${admin.isMainAdmin ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}>
                    {admin.isMainAdmin ? 'Main Admin' : 'Sub Admin'}
                  </span>
                </div>
              </div>
              
              {!admin.isMainAdmin && (
                <button onClick={() => handleDelete(admin._id, admin.isMainAdmin)} className="text-rose-500 p-2 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors border border-transparent hover:border-rose-200 dark:hover:border-rose-800">
                   <Trash2 size={20} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Sub-Admin">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">New Username</label>
            <input required type="text" className="input-field" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} placeholder="e.g. member123"/>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Set Password</label>
            <input required type="password" className="input-field" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="Create a password"/>
          </div>
          <div className="pt-6 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-700">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary shadow-[0_0_15px_rgba(249,115,22,0.3)]">Create Admin</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminUsers;
