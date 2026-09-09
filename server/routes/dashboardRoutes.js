import express from 'express';
import { getDashboardAnalytics } from '../services/analyticsService.js';
import Festival from '../models/Festival.js';
import Fund from '../models/Fund.js';
import Expense from '../models/Expense.js';
import Event from '../models/Event.js';
import Location from '../models/Location.js';
import { requireMainAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const data = await getDashboardAnalytics();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.get('/export', requireMainAdmin, async (req, res, next) => {
  try {
    const data = {
      festival: await Festival.find(),
      funds: await Fund.find(),
      expenses: await Expense.find(),
      events: await Event.find(),
      locations: await Location.find()
    };
    res.setHeader('Content-disposition', 'attachment; filename=vinayaka_data.json');
    res.setHeader('Content-type', 'application/json');
    res.send(JSON.stringify(data, null, 2));
  } catch (error) { next(error); }
});

export default router;
