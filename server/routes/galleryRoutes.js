import express from 'express';
import Gallery from '../models/Gallery.js';
import upload from '../middleware/upload.js';
import { uploadToGridFS, deleteFromGridFS } from '../services/gridfsService.js';
import { getGridFSBucket } from '../config/db.js';
import { apiKeyAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const photos = await Gallery.find().sort({ eventDate: -1 });
    res.json({ success: true, data: photos });
  } catch (error) {
    next(error);
  }
});

router.post('/upload', apiKeyAuth, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    const gridFsFileId = await uploadToGridFS(req.file);
    
    const galleryEntry = await Gallery.create({
      filename: req.file.originalname,
      gridFsFileId,
      contentType: req.file.mimetype,
      caption: req.body.caption || '',
      description: req.body.description || '',
      eventDate: req.body.eventDate || Date.now(),
      size: req.file.size
    });

    res.status(201).json({ success: true, data: galleryEntry, message: 'Image uploaded successfully' });
  } catch (error) {
    next(error);
  }
});

router.get('/image/:id', async (req, res, next) => {
  try {
    const bucket = getGridFSBucket();
    const photo = await Gallery.findById(req.params.id);
    
    if (!photo) return res.status(404).json({ success: false, message: 'Image not found' });

    res.set('Content-Type', photo.contentType);
    res.set('Cache-Control', 'public, max-age=31536000');
    const downloadStream = bucket.openDownloadStream(photo.gridFsFileId);
    downloadStream.pipe(res);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', apiKeyAuth, async (req, res, next) => {
  try {
    const photo = await Gallery.findById(req.params.id);
    if (!photo) return res.status(404).json({ success: false, message: 'Image not found' });

    await deleteFromGridFS(photo.gridFsFileId);
    await Gallery.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
