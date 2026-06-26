import express from 'express';
import { createTicket, getAllTickets } from '../controllers/ticketController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Secures your data paths so only logged-in users can execute them
router.post('/tickets', protect, createTicket);
router.get('/tickets', protect, getAllTickets);

export default router;