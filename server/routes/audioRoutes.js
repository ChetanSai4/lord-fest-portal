import express from 'express';
import Audio from '../models/Audio.js';
import upload from '../middleware/upload.js';
import { uploadToGridFS, deleteFromGridFS } from '../services/gridfsService.js';
import { getGridFSBucket } from '../config/db.js';
import { apiKeyAuth } from '../middleware/auth.js';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const audioFiles = await Audio.find().sort({ createdAt: -1 });
    res.json({ success: true, data: audioFiles });
  } catch (error) {
    next(error);
  }
});

router.post('/upload', apiKeyAuth, upload.single('audio'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    const gridFsFileId = await uploadToGridFS(req.file);
    
    const audioEntry = await Audio.create({
      filename: req.file.originalname,
      gridFsFileId,
      title: req.body.title || req.file.originalname,
      artist: req.body.artist || 'Unknown',
      category: req.body.category || 'Devotional',
      description: req.body.description || '',
      contentType: req.file.mimetype,
      duration: req.body.duration || 0,
      size: req.file.size
    });

    res.status(201).json({ success: true, data: audioEntry, message: 'Audio uploaded successfully' });
  } catch (error) {
    next(error);
  }
});

router.get('/stream/:id', async (req, res, next) => {
  try {
    const bucket = getGridFSBucket();
    const audio = await Audio.findById(req.params.id);
    
    if (!audio) return res.status(404).json({ success: false, message: 'Audio not found' });

    // Ensure we handle HTTP Range requests for audio seeking
    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const partialstart = parts[0];
      const partialend = parts[1];

      const start = parseInt(partialstart, 10);
      const end = partialend ? parseInt(partialend, 10) : audio.size - 1;
      const chunksize = (end - start) + 1;

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${audio.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': audio.contentType,
        'Cache-Control': 'public, max-age=31536000'
      });

      const downloadStream = bucket.openDownloadStream(audio.gridFsFileId, {
        start,
        end: end + 1
      });
      downloadStream.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': audio.size,
        'Content-Type': audio.contentType,
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=31536000'
      });
      const downloadStream = bucket.openDownloadStream(audio.gridFsFileId);
      downloadStream.pipe(res);
    }
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', apiKeyAuth, async (req, res, next) => {
  try {
    const audio = await Audio.findById(req.params.id);
    if (!audio) return res.status(404).json({ success: false, message: 'Audio not found' });

    await deleteFromGridFS(audio.gridFsFileId);
    await Audio.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Audio deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
