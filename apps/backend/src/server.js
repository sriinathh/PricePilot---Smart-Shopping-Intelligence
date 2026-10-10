const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();
const { connectDB, sequelize } = require('./models/index');

const app = express();

app.use(express.json());
app.use(cors({ origin: '*' }));
app.use(helmet());
app.use(morgan('dev'));

// Sync SQLite Database
sequelize.sync({ alter: true }).then(() => console.log('SQLite tables synced'));

// Routes
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/watchlist', require('./routes/watchlistRoutes'));
app.use('/api/v1/alerts', require('./routes/alertRoutes'));
app.use('/api/v1/products', require('./routes/productRoutes'));

app.get('/api/v1/health', (req, res) => res.status(200).json({ status: 'ok', db: 'sqlite' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
