const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const { connectDB } = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const thesisRoutes = require('./routes/thesis');
const calendarRoutes = require('./routes/calendar');
const adminRoutes = require('./routes/admin');
const dashboardRoutes = require('./routes/dashboard');
const courseRoutes = require('./routes/courses');

const app = express();

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting - more lenient in development
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // Higher limit in development
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware - Use 'combined' for more info, 'dev' for less, or disable entirely
// Set to 'dev' for minimal output, or false to disable HTTP logging
if (process.env.NODE_ENV === 'development' && process.env.ENABLE_HTTP_LOGGING === 'true') {
  app.use(morgan('dev'));
}

// Static files - only serve locally, use cloud storage in production
if (process.env.STORAGE_TYPE === 'local' || !process.env.STORAGE_TYPE) {
  app.use('/uploads', express.static('uploads'));
}

// Database connection (non-blocking - server starts even if DB connection fails)
// This allows health endpoint to work even if database isn't set up yet
connectDB().catch(err => {
  console.error('Initial database connection failed:', err.message);
  console.warn('Server will continue running. Database connection will be retried.');
  console.warn('⚠️  Some API endpoints may not work until database is connected.');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/thesis', thesisRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/courses', courseRoutes);

// Test dashboard route directly
app.get('/api/dashboard/test-direct', (req, res) => {
  res.json({ message: 'Direct dashboard route works!', timestamp: new Date().toISOString() });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'One Faith One Archive API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
