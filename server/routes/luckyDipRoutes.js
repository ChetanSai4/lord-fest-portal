import express from 'express';
import LuckyDip from '../models/LuckyDip.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const tickets = await LuckyDip.find().sort({ createdAt: -1 });
    res.json({ success: true, data: tickets });
  } catch (error) { next(error); }
});

router.post('/', async (req, res, next) => {
  try {
    const ticket = await LuckyDip.create(req.body);
    res.status(201).json({ success: true, data: ticket });
  } catch (error) { next(error); }
});

export default router;
