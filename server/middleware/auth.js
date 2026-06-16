import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes — require valid JWT
export const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized — no token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'User not found or deactivated' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized — token invalid' });
  }
};

// Authorize specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: `Role '${req.user.role}' not authorized` });
    }
    next();
  };
};

// Generate JWT access token
export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '1h' }
  );
};

// Generate JWT refresh token
export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id, type: 'refresh' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
  );
};

// Generate token pair
export const generateTokenPair = (user) => {
  return {
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user),
    tokenType: 'Bearer',
    expiresIn: 3600,
  };
};
