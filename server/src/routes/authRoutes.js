const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { loginRateLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

const generateTokens = (user) => {
  const payload = { id: user._id, role: user.role, name: user.name };
  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: '15m',
  });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });
  return { accessToken, refreshToken };
};

router.post('/signup', async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'customer',
      isApproved: role === 'customer' || role === 'admin' ? true : false,
    });
    const { accessToken, refreshToken } = generateTokens(user);
    res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({
        success: true,
        data: {
          user: { id: user._id, name: user.name, email: user.email, role: user.role, isApproved: user.isApproved },
          accessToken,
        },
      });
  } catch (err) {
    next(err);
  }
});

router.post('/login', loginRateLimiter, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }
    if (!user.isApproved && user.role !== 'customer') {
      return res.status(403).json({ success: false, message: 'Account pending approval' });
    }
    const { accessToken, refreshToken } = generateTokens(user);
    res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        data: {
          user: { id: user._id, name: user.name, email: user.email, role: user.role, isApproved: user.isApproved },
          accessToken,
        },
      });
  } catch (err) {
    next(err);
  }
});

router.post('/refresh-token', (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ success: false, message: 'No refresh token' });
    }
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const payload = { id: decoded.id, role: decoded.role, name: decoded.name };
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: '15m',
    });
    res.json({ success: true, data: { accessToken } });
  } catch (err) {
    next(err);
  }
});

router.post('/logout', (req, res) => {
  res
    .clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })
    .json({ success: true, message: 'Logged out' });
});

module.exports = router;


