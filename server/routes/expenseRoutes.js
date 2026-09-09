import express from 'express';
import Expense from '../models/Expense.js';
import { apiKeyAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.category) query.category = req.query.category;
    if (req.query.search) {
      query.title = { $regex: req.query.search, $options: 'i' };
    }

    const expenses = await Expense.find(query).sort({ date: -1 }).skip(skip).limit(limit);
    const total = await Expense.countDocuments(query);

    res.json({ success: true, data: { expenses, total, page, pages: Math.ceil(total / limit) } });
  } catch (error) {
    next(error);
  }
});

router.post('/', apiKeyAuth, async (req, res, next) => {
  try {
    const expense = await Expense.create(req.body);
    res.status(201).json({ success: true, data: expense, message: 'Expense added successfully' });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', apiKeyAuth, async (req, res, next) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: expense, message: 'Expense updated successfully' });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', apiKeyAuth, async (req, res, next) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Expense deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
