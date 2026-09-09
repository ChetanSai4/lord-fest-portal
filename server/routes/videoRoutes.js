import express from 'express';
import Video from '../models/Video.js';
import { apiKeyAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const videos = await Video.find().sort({ uploadDate: -1 });
    res.json({ success: true, data: videos });
  } catch (error) { next(error); }
});

router.post('/', apiKeyAuth, async (req, res, next) => {
  try {
    const video = await Video.create(req.body);
    res.status(201).json({ success: true, data: video });
  } catch (error) { next(error); }
});

router.delete('/:id', apiKeyAuth, async (req, res, next) => {
  try {
    await Video.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Video deleted' });
  } catch (error) { next(error); }
});

router.put('/:id', apiKeyAuth, async (req, res, next) => {
  try {
    const video = await Video.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: video });
  } catch (error) { next(error); }
});

export default router;
