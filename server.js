import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';
import ticketRoutes from './src/routes/ticketRoutes.js';

dotenv.config();
const app = express();

// Create an HTTP server wrapper around your Express instance
const httpServer = createServer(app);

// Initialize Socket.IO with CORS settings matching your Vite port
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173', // Matches your frontend development port
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Run the database connection
connectDB();

app.use(cors());
app.use(express.json());

// Share the 'io' instance with your Express routes by attaching it to the request object
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Mount App Endpoints
app.use('/api', authRoutes);
app.use('/api', ticketRoutes);

// Monitor active real-time connections from your frontend
io.on('connection', (socket) => {
  console.log(`User connected with socket ID: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
// CRITICAL: Change app.listen to httpServer.listen so sockets can hook through!
httpServer.listen(PORT, () => console.log(`Server executing seamlessly on port ${PORT}`));