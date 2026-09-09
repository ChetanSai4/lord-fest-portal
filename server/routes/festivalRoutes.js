import express from 'express';
import Festival from '../models/Festival.js';
import { apiKeyAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const festival = await Festival.findOne();
    res.json({ success: true, data: festival });
  } catch (error) {
    next(error);
  }
});

router.put('/', apiKeyAuth, async (req, res, next) => {
  try {
    let festival = await Festival.findOne();
    if (festival) {
      festival = await Festival.findByIdAndUpdate(festival._id, req.body, { new: true });
    } else {
      festival = await Festival.create(req.body);
    }
    res.json({ success: true, data: festival, message: 'Festival info updated successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
