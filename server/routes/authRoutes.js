import express from 'express';
import jwt from 'jsonwebtoken';
import AdminUser from '../models/AdminUser.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'vinayaka_secret_token_1234';

router.post('/login', async (req, res, next) => {
  try {
    let { username, password } = req.body;
    if (username && username.startsWith('0')) {
       username = username.substring(1);
    }
    const user = await AdminUser.findOne({ username });
    
    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, isMainAdmin: user.isMainAdmin }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ success: true, token, user: { username: user.username, isMainAdmin: user.isMainAdmin } });
  } catch (error) { next(error); }
});

export default router;
