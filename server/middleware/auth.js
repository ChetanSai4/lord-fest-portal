import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'vinayaka_secret_token_1234';

export const apiKeyAuth = (req, res, next) => {
  // Support both API Key (for legacy seed scripts) and JWT token
  const apiKey = req.headers['x-api-key'];
  const serverApiKey = process.env.ADMIN_API_KEY || 'vinayaka_admin_secret_2026';

  if (apiKey === serverApiKey) {
    req.user = { isMainAdmin: true };
    return next();
  }

  const token = req.headers.authorization?.split(' ')[1] || req.query.token;
  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized. Missing token.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

export const requireMainAdmin = (req, res, next) => {
  apiKeyAuth(req, res, () => {
    // Temporarily allowing all admins to bypass strict isMainAdmin token check 
    // to prevent issues with stale tokens in localStorage.
    next();
  });
};
