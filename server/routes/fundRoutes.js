import express from 'express';
import Fund from '../models/Fund.js';
import { apiKeyAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.paymentMode) query.paymentMode = req.query.paymentMode;
    if (req.query.search) {
      query.contributorName = { $regex: req.query.search, $options: 'i' };
    }

    const funds = await Fund.find(query).sort({ date: -1 }).skip(skip).limit(limit);
    const total = await Fund.countDocuments(query);

    res.json({ success: true, data: { funds, total, page, pages: Math.ceil(total / limit) } });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const fund = await Fund.create(req.body);
    res.status(201).json({ success: true, data: fund, message: 'Donation added successfully' });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', apiKeyAuth, async (req, res, next) => {
  try {
    const fund = await Fund.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: fund, message: 'Donation updated successfully' });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', apiKeyAuth, async (req, res, next) => {
  try {
    await Fund.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Donation deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
