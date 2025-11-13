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

// Trust proxy - Required for Render, Vercel, and other hosting platforms that use reverse proxies
// This allows express-rate-limit to correctly identify client IPs
app.set('trust proxy', true);

// Security middleware
app.use(helmet());
app.use(compression());

// Health check endpoint (define BEFORE rate limiting to exclude it)
// This endpoint should NOT be rate limited for monitoring purposes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'One Faith One Archive API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rate limiting - more lenient in development
// Apply rate limiting to API routes (health endpoint is already defined above)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // Higher limit in development
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  trustProxy: 1, // Trust only the first proxy (Railway) - more secure than true
  skip: (req) => {
    // Skip rate limiting for health endpoint (already handled above, but keep as safety)
    const path = req.path || req.originalUrl || '';
    return path === '/health' || path === '/api/health' || path.endsWith('/health');
  }
});

// Apply rate limiting to API routes
app.use('/api/', limiter);

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://onefaithonearchive.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173'
].filter(Boolean); // Remove undefined values

// Improved CORS configuration with explicit headers
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }
    
    // Allow if origin is in allowed list, or in development mode, or always allow in production for now
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production') {
      callback(null, true);
    } else {
      console.warn('CORS: Unknown origin:', origin);
      // Still allow but log warning (can be restricted later)
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Length', 'Content-Type'],
  maxAge: 86400, // 24 hours
  preflightContinue: false,
  optionsSuccessStatus: 200
}));

// Additional CORS handling for edge cases
app.use((req, res, next) => {
  // Always set CORS headers if not already set
  if (!res.headersSent) {
    const origin = req.headers.origin;
    if (origin && (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'production')) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
    }
    
    // Handle OPTIONS preflight requests
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
  }
  next();
});

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
