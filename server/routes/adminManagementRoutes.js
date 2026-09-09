import express from 'express';
import AdminUser from '../models/AdminUser.js';
import { requireMainAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireMainAdmin, async (req, res, next) => {
  try {
    const admins = await AdminUser.find().select('-password');
    res.json({ success: true, data: admins });
  } catch (error) { next(error); }
});

router.post('/', requireMainAdmin, async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const exists = await AdminUser.findOne({ username });
    if (exists) return res.status(400).json({ success: false, message: 'Username already exists' });
    
    const newAdmin = await AdminUser.create({ username, password, isMainAdmin: false });
    res.status(201).json({ success: true, data: { username: newAdmin.username } });
  } catch (error) { next(error); }
});

router.delete('/:id', requireMainAdmin, async (req, res, next) => {
  try {
    const admin = await AdminUser.findById(req.params.id);
    if (admin.isMainAdmin) return res.status(403).json({ success: false, message: 'Cannot delete Main Admin' });
    
    await AdminUser.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Admin deleted' });
  } catch (error) { next(error); }
});

export default router;
