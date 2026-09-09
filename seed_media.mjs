import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';

const uploadMedia = async () => {
  try {
    const adminKey = 'vinayaka_admin_secret_2026';
    
    // Upload image
    const formImage = new FormData();
    formImage.append('image', fs.createReadStream('server/seed/dummy.jpg'));
    await axios.post('http://localhost:5001/api/gallery/upload', formImage, {
      headers: { ...formImage.getHeaders(), 'x-api-key': adminKey, 'Origin': 'http://localhost:5173' }
    });
    console.log('Image uploaded');

    // Upload audio
    const formAudio = new FormData();
    formAudio.append('audio', fs.createReadStream('server/seed/dummy.mp3'));
    await axios.post('http://localhost:5001/api/audio/upload', formAudio, {
      headers: { ...formAudio.getHeaders(), 'x-api-key': adminKey, 'Origin': 'http://localhost:5173' }
    });
    console.log('Audio uploaded');
  } catch (error) {
    console.error('Error uploading:', JSON.stringify(error.response?.data || error.message));
  }
};

uploadMedia();
