import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-md' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-0">
      <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className={`relative bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl w-full ${maxWidth} transform transition-all flex flex-col max-h-[90vh]`}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none rounded-2xl"></div>
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 z-10 relative">
          <h3 className="text-xl font-bold text-white tracking-wide">{title}</h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-2 rounded-xl transition-all shadow-sm"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="px-6 py-6 overflow-y-auto flex-1 z-10 relative text-slate-300">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
