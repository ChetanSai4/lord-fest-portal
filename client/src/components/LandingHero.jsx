import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Sparkles } from 'lucide-react';

const LandingHero = () => {
  const [isEntered, setIsEntered] = useState(false);

  if (isEntered) return null;

  return (
    <AnimatePresence>
      <motion.div 
        key="hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, y: -50, filter: 'blur(10px)' }}
        transition={{ duration: 0.8, ease: "easeOut" }} 
        className="fixed inset-0 z-[100] flex flex-col items-center justify-end pb-32 bg-black overflow-hidden"
      >
      
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60 z-10" />
        <img 
          src="/hero-backdrop-new.jpg" 
          alt="Lord Ganesha" 
          className="w-full h-full object-cover object-center opacity-90"
        />
      </div>

      {/* Floating Animated Orbs (Simplified to avoid glitches) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-saffron-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '4s' }} />
         <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-divine-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '6s' }} />
      </div>

      {/* Extreme Top Right Text Reveal */}
      <div className="absolute top-0 right-0 z-20 pt-8 pr-6 md:pt-16 md:pr-16 max-w-full">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="flex flex-col items-end text-right"
        >
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="text-saffron-400 animate-pulse hero-text" size={24} />
            <h1 className="hero-text text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-saffron-300 via-white to-divine-200 uppercase tracking-tighter drop-shadow-[0_0_20px_rgba(249,115,22,0.8)]">
              Sri Vinayaka
            </h1>
          </div>
          
          <h1 className="hero-text text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] mb-4">
             Yuvajana Sangham
          </h1>

          <div className="px-6 py-2 bg-white/5 backdrop-blur-xl border border-white/20 rounded-full shadow-[0_0_30px_rgba(249,115,22,0.3)]">
            <p className="hero-text text-sm sm:text-base md:text-xl text-saffron-200 font-bold tracking-[0.2em] uppercase">
              Grand 11-Day Mahotsavam
            </p>
          </div>
        </motion.div>
      </div>

      {/* Interactive Glowing Button */}
      <div className="relative z-30 w-full h-full pb-16 px-4 flex flex-col items-center justify-end">
        <motion.button
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          whileHover={{ scale: 1.05, boxShadow: "0px 0px 40px rgba(249,115,22,0.8)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsEntered(true)}
          className="group relative px-10 py-5 bg-black/60 backdrop-blur-md border border-saffron-500/50 rounded-full font-black uppercase tracking-[0.3em] text-white hero-text overflow-hidden transition-all flex items-center gap-4 shadow-[0_0_20px_rgba(249,115,22,0.4)]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-saffron-600/40 via-divine-500/40 to-saffron-600/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="relative z-10 hero-text">Enter Portal</span>
          <ChevronDown className="relative z-10 animate-bounce text-saffron-300 hero-text group-hover:text-white transition-colors" size={24} />
        </motion.button>
      </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LandingHero;
