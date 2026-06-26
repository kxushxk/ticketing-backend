import Ticket from '../models/Ticket.js';

// Create a new ticket
export const createTicket = async (req, res) => {
  try {
    const { title, description } = req.body;
    
    const newTicket = await Ticket.create({
      title,
      description,
      creator: req.user.id // Captured automatically from your JWT authentication middleware guard
    });

    res.status(201).json(newTicket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Fetch all tickets from the cloud database
export const getAllTickets = async (req, res) => {
  try {
    // .populate links the user IDs to their actual names and emails for your UI
    const tickets = await Ticket.find()
      .populate('creator', 'name email')
      .populate('assignee', 'name email');
      
    res.status(200).json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};