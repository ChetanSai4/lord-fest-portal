import React, { useEffect, useState } from 'react';
import { getAudio, uploadAudio, deleteAudio } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useAudio } from '../context/AudioContext';
import { useToast } from '../context/ToastContext';
import { Play, Pause, Upload, Trash2, Music, Disc } from 'lucide-react';
import Modal from '../components/Modal';

const AudioPage = () => {
  const [tracks, setTracks] = useState([]);
  const { isAdmin } = useAuth();
  const { currentTrack, isPlaying, playTrack } = useAudio();
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState(null);

  const fetchAudio = () => getAudio().then(res => setTracks(res.data.data));
  useEffect(() => { fetchAudio(); }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append('audio', file);
    try {
      await uploadAudio(formData);
      addToast('Audio uploaded', 'success');
      setIsModalOpen(false);
      setFile(null);
      fetchAudio();
    } catch (err) {
      addToast('Upload failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    if(!confirm('Delete this track?')) return;
    try {
      await deleteAudio(id);
      addToast('Audio deleted', 'info');
      fetchAudio();
    } catch (err) {
      addToast('Delete failed', 'error');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto relative z-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-200 tracking-tight">Audio Library</h2>
           <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium">Sacred chants and devotional tracks.</p>
        </div>
        {isAdmin && (
          <button onClick={() => setIsModalOpen(true)} className="btn-primary py-2.5 px-6">
            <Upload size={18} className="mr-2" /> Upload Track
          </button>
        )}
      </div>

      <div className="card border-0 shadow-lg ring-1 ring-slate-200 dark:ring-slate-700">
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {tracks.map(track => {
            const isThisPlaying = currentTrack?._id === track._id && isPlaying;
            return (
              <div key={track._id} className="p-5 flex items-center justify-between hover:bg-slate-50/80 dark:hover:bg-slate-800/50 group transition-all duration-300">
                <div className="flex items-center gap-5">
                  <button 
                    onClick={() => playTrack(track, tracks)}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm ${isThisPlaying ? 'bg-saffron-600 text-white shadow-[0_0_20px_rgba(249,115,22,0.4)] ring-4 ring-saffron-100' : 'bg-white dark:bg-slate-800 text-saffron-500 hover:bg-saffron-50 dark:hover:bg-slate-700 hover:scale-105 border border-slate-200 dark:border-slate-700'}`}
                  >
                    {isThisPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                  </button>
                  <div>
                    <h4 className={`text-lg font-extrabold transition-colors ${isThisPlaying ? 'text-saffron-600' : 'text-slate-800 dark:text-slate-200'}`}>{track.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-1 tracking-wider uppercase flex items-center gap-1"><Disc size={14} className={isThisPlaying ? 'animate-spin' : ''}/> {track.category}</p>
                  </div>
                </div>
                
                {isAdmin && (
                  <button onClick={() => handleDelete(track._id)} className="opacity-0 group-hover:opacity-100 text-rose-500 p-2 transition-all hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-xl shadow-sm border border-transparent hover:border-rose-100 dark:hover:border-rose-800">
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            );
          })}
          {tracks.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
               <Music size={64} className="mb-4 opacity-30" />
               <p className="text-lg font-bold">Audio archive is empty.</p>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Upload Audio">
        <form onSubmit={handleUpload} className="space-y-6">
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center hover:border-saffron-500 hover:bg-saffron-50 dark:hover:bg-slate-700 transition-colors bg-slate-50 dark:bg-slate-800">
            <Music size={40} className="mx-auto text-saffron-500 mb-4" />
            <input required type="file" accept="audio/*" onChange={e => setFile(e.target.files[0])} className="w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-white dark:file:bg-slate-700 file:text-saffron-600 hover:file:bg-saffron-50 dark:hover:file:bg-slate-600 cursor-pointer shadow-sm border border-slate-200 dark:border-slate-600" />
          </div>
          <div className="pt-2 flex justify-end">
            <button type="submit" className="btn-primary w-full shadow-[0_0_15px_rgba(249,115,22,0.3)]" disabled={!file}>Initiate Upload</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AudioPage;
