import React from 'react';
import { useAudio } from '../context/AudioContext';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music, Disc } from 'lucide-react';

const GlobalAudioPlayer = () => {
  const { currentTrack, isPlaying, progress, togglePlay, seek, stopTrack } = useAudio();

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-24 bg-white/90 border-t border-slate-200/60 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-50 px-6 lg:px-10 flex items-center justify-between backdrop-blur-xl">
      
      {/* Track Info */}
      <div className="flex items-center gap-4 w-1/3">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-700 shadow-sm ${isPlaying ? 'bg-gradient-to-br from-saffron-500 to-rose-500 border-saffron-200 shadow-[0_0_15px_rgba(249,115,22,0.3)] animate-[spin_4s_linear_infinite]' : 'bg-slate-50 border-slate-200'}`}>
          <Disc size={28} className={isPlaying ? 'text-white' : 'text-slate-400'} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-extrabold text-slate-800 truncate">{currentTrack.title}</p>
          <p className="text-xs text-saffron-600 font-bold truncate uppercase tracking-widest mt-1 bg-saffron-50 inline-block px-2 py-0.5 rounded">{currentTrack.artist || currentTrack.category}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center justify-center w-1/3 max-w-lg">
        <div className="flex items-center gap-6 mb-3">
          <button className="text-slate-400 hover:text-slate-800 transition-colors bg-slate-50 hover:bg-slate-100 rounded-full p-2 border border-slate-200 shadow-sm active:scale-95"><SkipBack size={18} /></button>
          <button 
            onClick={togglePlay}
            className="w-14 h-14 rounded-full bg-saffron-600 text-white flex items-center justify-center hover:bg-saffron-700 transition-all shadow-[0_0_15px_rgba(249,115,22,0.4)] hover:shadow-[0_0_20px_rgba(249,115,22,0.6)] active:scale-95"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
          </button>
          <button className="text-slate-400 hover:text-slate-800 transition-colors bg-slate-50 hover:bg-slate-100 rounded-full p-2 border border-slate-200 shadow-sm active:scale-95"><SkipForward size={18} /></button>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full flex items-center gap-3">
          <div 
            className="h-2 flex-1 bg-slate-100 rounded-full cursor-pointer overflow-hidden group relative border border-slate-200 shadow-inner"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const percent = ((e.clientX - rect.left) / rect.width) * 100;
              seek(percent);
            }}
          >
            <div 
              className="h-full bg-gradient-to-r from-saffron-500 to-saffron-400 relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-full shadow-sm"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Volume & Close */}
      <div className="flex items-center justify-end w-1/3 gap-4 hidden md:flex">
        <Volume2 size={20} className="text-slate-400" />
        <div className="w-24 h-2 bg-slate-100 rounded-full cursor-pointer border border-slate-200 shadow-inner mr-4">
           <div className="h-full bg-slate-400 rounded-full w-2/3"></div>
        </div>
        <button 
          onClick={stopTrack}
          className="text-slate-400 hover:text-rose-500 transition-colors p-2 rounded-full hover:bg-rose-50"
          title="Close Player"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
    </div>
  );
};

export default GlobalAudioPlayer;
