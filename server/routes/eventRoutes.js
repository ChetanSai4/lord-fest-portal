import express from 'express';
import Event from '../models/Event.js';
import { apiKeyAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const events = await Event.find().sort({ date: 1, startTime: 1 });
    res.json({ success: true, data: events });
  } catch (error) {
    next(error);
  }
});

router.post('/', apiKeyAuth, async (req, res, next) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json({ success: true, data: event, message: 'Event created successfully' });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', apiKeyAuth, async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: event, message: 'Event updated successfully' });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', apiKeyAuth, async (req, res, next) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
