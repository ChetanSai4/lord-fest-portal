import axios from 'axios';

export const API_BASE_URL = 'https://lord-fest-portal.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

const cache = new Map();

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  if (config.method === 'get') {
    const cachedData = cache.get(config.url);
    if (cachedData) {
      config.adapter = () => Promise.resolve({
        data: cachedData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        request: {}
      });
    }
  } else {
    cache.clear();
  }
  return config;
});

api.interceptors.response.use(response => {
  if (response.config.method === 'get') {
    cache.set(response.config.url, response.data);
  }
  return response;
});

export const getDashboard = () => api.get('/dashboard');
export const getFestival = () => api.get('/festival');
export const getFunds = () => api.get('/funds');
export const createFund = (data) => api.post('/funds', data);
export const updateFund = (id, data) => api.put(`/funds/${id}`, data);
export const deleteFund = (id) => api.delete(`/funds/${id}`);

export const getExpenses = () => api.get('/expenses');
export const createExpense = (data) => api.post('/expenses', data);
export const updateExpense = (id, data) => api.put(`/expenses/${id}`, data);
export const deleteExpense = (id) => api.delete(`/expenses/${id}`);
export const getEvents = () => api.get('/events');
export const getGallery = () => api.get('/gallery');
export const uploadGallery = (data) => api.post('/gallery/upload', data, { headers: { 'Content-Type': 'multipart/form-data' }});
export const deleteGallery = (id) => api.delete(`/gallery/${id}`);
export const getAudio = () => api.get('/audio');
export const uploadAudio = (data) => api.post('/audio/upload', data, { headers: { 'Content-Type': 'multipart/form-data' }});
export const deleteAudio = (id) => api.delete(`/audio/${id}`);
export const getLocation = () => api.get('/location');

export const getVideos = () => api.get('/videos');
export const createVideo = (data) => api.post('/videos', data);
export const updateVideo = (id, data) => api.put(`/videos/${id}`, data);
export const deleteVideo = (id) => api.delete(`/videos/${id}`);

export const loginAdmin = (data) => api.post('/auth/login', data);
export const getAdmins = () => api.get('/admin');
export const createAdmin = (data) => api.post('/admin', data);
export const deleteAdmin = (id) => api.delete(`/admin/${id}`);

export const getLadduBids = () => api.get('/laddu');
export const createLadduBid = (data) => api.post('/laddu', data);

export const getLuckyDip = () => api.get('/lucky-dip');
export const createLuckyDip = (data) => api.post('/lucky-dip', data);

export default api;
