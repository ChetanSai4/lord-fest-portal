import express from 'express';
import Location from '../models/Location.js';
import { apiKeyAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const location = await Location.findOne();
    res.json({ success: true, data: location });
  } catch (error) {
    next(error);
  }
});

router.put('/', apiKeyAuth, async (req, res, next) => {
  try {
    let location = await Location.findOne();
    if (location) {
      location = await Location.findByIdAndUpdate(location._id, req.body, { new: true });
    } else {
      location = await Location.create(req.body);
    }
    res.json({ success: true, data: location, message: 'Location updated successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
