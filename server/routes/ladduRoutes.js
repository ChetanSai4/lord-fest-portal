import express from 'express';
import LadduBid from '../models/LadduBid.js';
import { apiKeyAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const bids = await LadduBid.find().sort({ amount: -1 });
    res.json({ success: true, data: bids });
  } catch (error) { next(error); }
});

router.post('/', async (req, res, next) => {
  try {
    const bid = await LadduBid.create(req.body);
    res.status(201).json({ success: true, data: bid });
  } catch (error) { next(error); }
});

export default router;
