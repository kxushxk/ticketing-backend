import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// 1. Send OTP Step
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email already registered' });

    res.status(200).json({ message: "Mock OTP generated. Use code '123456' to verify." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Complete Registration Step (Saves account as pending approval)
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;
    if (otp !== '123456') return res.status(400).json({ message: 'Invalid OTP code' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      isApproved: false
    });

    res.status(201).json({ message: 'Registration requested! Awaiting admin approval.', userId: newUser._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Login Step (Updated keys to match your frontend interceptor expectations!)
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    if (!user.isApproved) return res.status(403).json({ message: 'Account pending admin approval.' });

    // Matches your frontend's naming conversion tokens
    const accessToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ 
      accessToken, 
      refreshToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role } 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Token Refresh Session Loop Step (Added for your interceptor's 401 recovery loop!)
export const refreshSession = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ message: 'Refresh token missing' });

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    
    const newAccessToken = jwt.sign({ id: decoded.id, role: decoded.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const newRefreshToken = jwt.sign({ id: decoded.id, role: decoded.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ 
      accessToken: newAccessToken, 
      refreshToken: newRefreshToken 
    });
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
};