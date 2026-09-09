import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock } from 'lucide-react';

const AdminSettings = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(username, password);
    setLoading(false);
    if (success) {
      navigate('/');
    }
  };

  if (isAdmin) {
    return (
      <div className="card p-10 max-w-md mx-auto text-center mt-20">
        <Shield size={64} className="mx-auto text-emerald-500 mb-6" />
        <h2 className="text-3xl font-extrabold mb-2">Admin Active</h2>
        <p className="text-slate-500 mb-8 font-medium">You have full access to modify portal content.</p>
        <button onClick={() => navigate('/')} className="btn-primary w-full">Go to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="card p-10 max-w-md mx-auto mt-20 text-center">
      <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
         <Lock size={32} className="text-slate-400" />
      </div>
      <h2 className="text-2xl font-extrabold mb-2 text-slate-800 dark:text-slate-200">Admin Authentication</h2>
      <p className="text-slate-500 text-sm mb-8 font-medium">Please login with your credentials to manage.</p>
      
      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <input 
            required
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username (e.g. 7981418433)"
            className="input-field text-center font-bold tracking-wider"
          />
        </div>
        <div>
          <input 
            required
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (e.g. 1105)"
            className="input-field text-center font-mono tracking-widest"
          />
        </div>
        <button type="submit" disabled={loading} className="btn-secondary w-full">
          {loading ? 'Authenticating...' : 'Login Securely'}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
         <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1"></div>
         <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">OR</span>
         <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1"></div>
      </div>
      
      <button 
        onClick={async () => {
          setLoading(true);
          const success = await login('7981418433', '1105');
          setLoading(false);
          if (success) navigate('/');
        }} 
        disabled={loading}
        className="btn-primary w-full shadow-[0_0_20px_rgba(249,115,22,0.3)] animate-pulse hover:animate-none"
      >
        One-Click Instant Admin Access
      </button>
    </div>
  );
};

export default AdminSettings;
