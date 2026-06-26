import express from 'express';
import { sendOtp, registerUser, loginUser, refreshSession } from '../controllers/authController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import User from '../models/User.js';

const router = express.Router();

router.post('/auth/send-otp', sendOtp);
router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);
router.post('/auth/refresh', refreshSession); // Mounts the refresh handler route

// Admin-only route to view pending sign-ups
router.get('/auth/pending-requests', protect, authorizeRoles('ADMIN'), async (req, res) => {
  const pending = await User.find({ isApproved: false });
  res.status(200).json(pending);
});

// Admin-only route to approve users
router.put('/auth/approve-request/:id', protect, authorizeRoles('ADMIN'), async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
  res.status(200).json({ message: `${user.name} approved successfully.` });
});

export default router;