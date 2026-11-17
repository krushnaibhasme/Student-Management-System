const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const connectDB = require('./src/config/db');
const studentRoutes = require('./src/routes/studentRoutes');
const { notFound, errorHandler } = require('./src/middleware/errorMiddleware');

// Initialize Express App
const app = express();

// Connect to MongoDB Atlas
connectDB();

// Dynamic CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  process.env.FRONTEND_URL
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, Postman, or server-to-server)
    if (!origin) return callback(null, true);

    // If FRONTEND_URL is set to '*' allow all
    if (process.env.FRONTEND_URL === '*') {
      return callback(null, true);
    }

    // Check if origin is in allowed list or is a Vercel deployment preview (*.vercel.app)
    const isAllowed =
      allowedOrigins.includes(origin) ||
      (origin.endsWith('.vercel.app') && !process.env.FRONTEND_URL_STRICT);

    if (isAllowed) {
      return callback(null, true);
    } else {
      return callback(
        new Error(`CORS policy error: Origin '${origin}' is not authorized. Configure FRONTEND_URL in backend environment variables.`)
      );
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// HTTP Request Logger
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsing middleware
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Root health-check endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    message: '🎓 Student Management System API is running successfully',
    version: '1.0.0',
    documentation: '/api/students'
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: 'connected'
  });
});

// API Routes
app.use('/api/students', studentRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

// Server Listening Port (compatible with Render dynamic PORT)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Server running in [${process.env.NODE_ENV || 'development'}] mode`);
  console.log(`📡 Listening on http://localhost:${PORT}`);
  console.log(`📖 API endpoint: http://localhost:${PORT}/api/students`);
  console.log(`🌐 Allowed Frontend: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`====================================================`);
});
