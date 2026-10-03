/**
 * Tourism Management System - Server Entry Point
 * Technology: Node.js, Express.js, MySQL
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const db = require('./config/db');

// Route imports
const authRoutes = require('./routes/authRoutes');
const destinationRoutes = require('./routes/destinationRoutes');
const packageRoutes = require('./routes/packageRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const contactRoutes = require('./routes/contactRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'Tourism Management System',
    timestamp: new Date().toISOString(),
    isUsingFallback: db.isUsingFallback()
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'An unexpected internal error occurred.',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start Server
async function startServer() {
  try {
    // Initialize database (MySQL connection + tables check / fallback)
    await db.initDB();

    app.listen(PORT, () => {
      console.log(`\n======================================================`);
      console.log(`🚀 Tourism Management System running on http://localhost:${PORT}`);
      console.log(`📁 Frontend: http://localhost:${PORT}`);
      console.log(`🛡️  Admin Dashboard: http://localhost:${PORT}/admin.html`);
      console.log(`🔑 Default Admin: admin@tourism.com / admin123`);
      console.log(`👤 Default User:  john@example.com / user123`);
      console.log(`======================================================\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
