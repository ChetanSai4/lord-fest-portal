import React, { useEffect, useState } from 'react';
import { getVideos, createVideo, updateVideo, deleteVideo } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Video as VideoIcon, Plus, Trash2, Play, Edit } from 'lucide-react';
import Modal from '../components/Modal';
import { AnimatePresence } from 'framer-motion';

const VideoPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', url: '', description: '' });

  const fetchVideos = () => {
    getVideos().then(res => {
      setVideos(res.data.data);
      setLoading(false);
    });
  };

  useEffect(() => { fetchVideos(); }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ title: '', url: '', description: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (video) => {
    setEditingId(video._id);
    setFormData({ title: video.title, url: video.url, description: video.description });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let finalUrl = formData.url;
      if (finalUrl.includes('youtube.com/watch?v=')) {
        finalUrl = finalUrl.replace('watch?v=', 'embed/');
        finalUrl = finalUrl.split('&')[0];
      } else if (finalUrl.includes('youtu.be/')) {
        finalUrl = finalUrl.replace('youtu.be/', 'www.youtube.com/embed/');
        finalUrl = finalUrl.split('?')[0];
      }
      
      if (editingId) {
        await updateVideo(editingId, { ...formData, url: finalUrl });
        addToast('Video updated successfully', 'success');
      } else {
        await createVideo({ ...formData, url: finalUrl });
        addToast('Video added successfully', 'success');
      }
      
      setIsModalOpen(false);
      setFormData({ title: '', url: '', description: '' });
      fetchVideos();
    } catch (err) {
      addToast(editingId ? 'Error updating video' : 'Error adding video', 'error');
    }
  };

  const handleDelete = async (id) => {
    if(!confirm('Delete this video?')) return;
    try {
      await deleteVideo(id);
      addToast('Video deleted', 'info');
      fetchVideos();
    } catch (err) {
      addToast('Delete failed', 'error');
    }
  };

  return (
    <div className="space-y-8 relative z-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h2 className="text-3xl font-extrabold text-divine-100 tracking-tight">Video Library</h2>
           <p className="text-divine-300 text-sm mt-1 font-medium">Daily highlights and live streams.</p>
        </div>
        {isAdmin && (
          <button onClick={openAddModal} className="btn-primary py-2.5 px-6">
            <Plus size={18} className="mr-2" /> Add Video Link
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {videos.map(video => (
          <div key={video._id} className="card p-4 group bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-none shadow-2xl">
            <div className="relative aspect-video rounded-xl overflow-hidden bg-obsidian-900 shadow-inner mb-4">
               <iframe 
                 src={video.url} 
                 title={video.title} 
                 className="absolute inset-0 w-full h-full border-0"
                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                 allowFullScreen
                 loading="lazy"
               ></iframe>
            </div>
            <div className="flex items-start justify-between gap-4 px-2">
               <div className="flex-1">
                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-100 line-clamp-1">{video.title}</h3>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">{video.description}</p>
               </div>
               {isAdmin && (
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEditModal(video)} className="text-saffron-500 p-2 hover:bg-saffron-50 rounded-lg transition-colors">
                       <Edit size={20} />
                    </button>
                    <button onClick={() => handleDelete(video._id)} className="text-rose-500 p-2 hover:bg-rose-50 rounded-lg transition-colors">
                       <Trash2 size={20} />
                    </button>
                  </div>
               )}
            </div>
          </div>
        ))}
        {!loading && videos.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-divine-400">
             <Play size={64} className="mb-4 opacity-30" />
             <p className="text-lg font-bold">No videos have been uploaded yet.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Edit Video" : "Add YouTube Video"}>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Video Title</label>
                <input required type="text" className="input-field" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Day 1 Highlights"/>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">YouTube Link / Embed URL</label>
                <input required type="url" className="input-field" value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} placeholder="https://www.youtube.com/watch?v=..." />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Description (Optional)</label>
                <textarea className="input-field min-h-[100px]" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
              </div>
              <div className="pt-6 flex justify-end gap-3 border-t border-slate-200">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700">Cancel</button>
                <button type="submit" className="btn-primary shadow-[0_0_15px_rgba(249,115,22,0.3)]">{editingId ? 'Update Video' : 'Save Video'}</button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VideoPage;
