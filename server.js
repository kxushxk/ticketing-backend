import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';
import ticketRoutes from './src/routes/ticketRoutes.js';

dotenv.config();
const app = express();

// Initialize MongoDB Connection
connectDB();

app.use(cors());
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173', // Change this to your exact Vite server URL if different
  credentials: true,               // Allows your frontend to securely send headers/cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
// Mount App Endpoints
app.use('/api', authRoutes);
app.use('/api', ticketRoutes);

app.get('/', (req, res) => {
  res.send('Ticketing System API Engine is running.');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server executing seamlessly on port ${PORT}`));