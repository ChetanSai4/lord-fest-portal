import React from 'react';
import { Mail, Phone, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-16 pb-8 border-t border-divine-300/10 pt-8 text-center text-sm text-divine-400">
      <div className="flex flex-col items-center justify-center gap-2 mb-4">
        <p className="flex items-center gap-1 font-medium">
          Built with <Heart size={14} className="text-rose-500 animate-pulse" /> by 
          <span className="font-extrabold text-divine-200">P. Chetan Sai</span>
        </p>
      </div>
      
      <div className="flex flex-wrap justify-center gap-6 font-mono text-xs">
        <a href="tel:7981418433" className="flex items-center gap-2 hover:text-divine-200 transition-colors">
          <Phone size={14} /> 7981418433
        </a>
        <a href="mailto:pethakamsettichetansai05@gmail.com" className="flex items-center gap-2 hover:text-divine-200 transition-colors">
          <Mail size={14} /> pethakamsettichetansai05@gmail.com
        </a>
      </div>
      
      <p className="mt-6 text-xs text-obsidian-500 font-bold uppercase tracking-widest">
        Sri Vinayaka Yuvajana Sangham • All Rights Reserved
      </p>
    </footer>
  );
};

export default Footer;
