import React, { useEffect, useState } from 'react';
import { getGallery, uploadGallery, deleteGallery, API_BASE_URL } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { UploadCloud, X, Maximize2, Image as ImageIcon } from 'lucide-react';
import Modal from '../components/Modal';
import { motion, AnimatePresence } from 'framer-motion';

const Gallery = () => {
  const [photos, setPhotos] = useState([]);
  const { isAdmin } = useAuth();
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lightboxImg, setLightboxImg] = useState(null);
  const [file, setFile] = useState(null);

  const fetchPhotos = () => getGallery().then(res => setPhotos(res.data.data));
  useEffect(() => { fetchPhotos(); }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      await uploadGallery(formData);
      addToast('Photo uploaded successfully', 'success');
      setIsModalOpen(false);
      setFile(null);
      fetchPhotos();
    } catch (err) {
      addToast('Upload failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    if(!confirm('Delete this photo?')) return;
    try {
      await deleteGallery(id);
      addToast('Photo deleted', 'info');
      fetchPhotos();
    } catch (err) {
      addToast('Delete failed', 'error');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 relative z-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
           <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-saffron-400 to-white drop-shadow-[0_0_10px_rgba(249,115,22,0.5)] tracking-tighter uppercase">Media Gallery</h2>
           <p className="text-saffron-200/60 text-sm mt-1 font-bold uppercase tracking-widest">High-resolution festival captures</p>
        </div>
        {isAdmin && (
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setIsModalOpen(true)} className="btn-primary py-2.5 px-6">
            <UploadCloud size={18} className="mr-2" /> Upload Photo
          </motion.button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {photos.map((photo, i) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, type: 'spring', stiffness: 200 }}
            whileHover={{ y: -10, scale: 1.05, rotate: Math.random() * 4 - 2 }}
            key={photo._id} 
            className="card relative group aspect-square rounded-2xl overflow-hidden bg-black/40 cursor-pointer p-1 border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
          >
            <div className="w-full h-full rounded-xl overflow-hidden relative">
              <img 
                src={`${API_BASE_URL}/gallery/image/${photo._id}`} 
                alt={photo.filename} 
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125"
                onClick={() => setLightboxImg(photo._id)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-between p-4">
                 <button onClick={() => setLightboxImg(photo._id)} className="text-white hover:text-saffron-400 transition-colors p-2 bg-white/10 rounded-xl backdrop-blur-md hover:bg-white/20"><Maximize2 size={20}/></button>
                 {isAdmin && (
                   <button onClick={(e) => { e.stopPropagation(); handleDelete(photo._id); }} className="text-red-500 bg-white/10 hover:bg-white/20 p-2 rounded-xl backdrop-blur-md transition-colors"><X size={20}/></button>
                 )}
              </div>
            </div>
          </motion.div>
        ))}
        {photos.length === 0 && (
           <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-500">
              <ImageIcon size={64} className="mb-4 opacity-30" />
              <p className="text-lg font-bold">No media captured yet.</p>
           </div>
        )}
      </div>

      <AnimatePresence>
      {lightboxImg && (
        <motion.div 
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
          exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4" 
          onClick={() => setLightboxImg(null)}
        >
          <button onClick={() => setLightboxImg(null)} className="absolute top-6 right-6 text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 transition-colors p-3 rounded-xl z-50"><X size={28}/></button>
          <motion.img 
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: -50 }}
            transition={{ type: 'spring', bounce: 0.4 }}
            src={`${API_BASE_URL}/gallery/image/${lightboxImg}`} 
            className="max-h-[90vh] max-w-[95vw] object-contain rounded-2xl shadow-[0_0_50px_rgba(249,115,22,0.3)]" 
            alt="Enlarged" 
            onClick={e => e.stopPropagation()}
          />
        </motion.div>
      )}
      </AnimatePresence>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Upload Media">
        <form onSubmit={handleUpload} className="space-y-6">
          <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center hover:border-saffron-500 hover:bg-saffron-500/10 transition-colors bg-black/40">
            <UploadCloud size={40} className="mx-auto text-saffron-500 mb-4 animate-bounce" />
            <input required type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} className="w-full text-sm text-slate-400 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-white/10 file:text-saffron-400 hover:file:bg-white/20 cursor-pointer shadow-sm border border-white/10" />
          </div>
          <div className="pt-2 flex justify-end">
            <button type="submit" className="btn-primary w-full shadow-[0_0_20px_rgba(249,115,22,0.6)]" disabled={!file}>Initiate Upload</button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default Gallery;
