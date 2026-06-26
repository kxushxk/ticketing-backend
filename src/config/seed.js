import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Ticket from '../models/Ticket.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const seedDatabase = async () => {
  try {
    // 1. Establish connection using your local or cloud URI variable
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to database for seeding...");

    // 2. Clear out any existing junk entries to start fresh
    await User.deleteMany({});
    await Ticket.deleteMany({});

    // 3. Create Mock Team Members
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const admin = await User.create({
      name: 'Koushik Admin',
      email: 'admin@ticketing.com',
      password: hashedPassword,
      role: 'ADMIN',
      isApproved: true
    });

    const developer = await User.create({
      name: 'Jane Dev',
      email: 'jane@ticketing.com',
      password: hashedPassword,
      role: 'DEVELOPER',
      isApproved: true
    });

    console.log('🌱 Mock Users seeded successfully!');

    // 4. Create Mock Tickets linked to those exact users
    await Ticket.create([
      {
        title: 'Fix Authentication Token Interceptor Timeout',
        description: 'Axios response interceptor loops indefinitely when refreshing tokens on a 401 response.',
        status: 'In Progress',
        creator: developer._id,
        assignee: developer._id
      },
      {
        title: 'Implement Dark Mode Theme Syncing via Tailwind',
        description: 'Ensure local storage reads previous user preference and prevents screen flickering on initial hydration.',
        status: 'Open',
        creator: admin._id,
        assignee: null
      },
      {
        title: 'Database Network Timeout Error Handling',
        description: 'Add specific error screen catching for instances when the network DNS blocks outward server connections.',
        status: 'Closed',
        creator: developer._id,
        assignee: admin._id
      }
    ]);

    console.log('🌱 Mock Tickets seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();