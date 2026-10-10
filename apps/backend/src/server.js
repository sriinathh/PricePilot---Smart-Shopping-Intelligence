const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
// Allow all origins in local development to prevent extension/dashboard blocks
app.use(cors({
  origin: '*'
}));
app.use(helmet());
app.use(morgan('dev'));

// Route files
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const watchlistRoutes = require('./routes/watchlistRoutes');
const alertRoutes = require('./routes/alertRoutes');
const startTracker = require('./jobs/trackerJob');

// Mount routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/watchlist', watchlistRoutes);
app.use('/api/v1/alerts', alertRoutes);

// Initialize background jobs
startTracker();

// Health Route
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'PricePilot API is running' });
});

// Root fallback route
app.get('/', (req, res) => {
  res.send('PricePilot Backend API is running. Access endpoints via /api/v1/');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Server Error' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
