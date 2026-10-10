const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const User = require('./src/models/User');
const Product = require('./src/models/Product');
const WatchlistItem = require('./src/models/WatchlistItem');
const PriceObservation = require('./src/models/PriceObservation');

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pricepilot');
    console.log('MongoDB Connected for Seeding');

    // Clear existing
    await User.deleteMany();
    await Product.deleteMany();
    await WatchlistItem.deleteMany();
    await PriceObservation.deleteMany();

    // Create User
    const user = await User.create({
      name: 'Demo User',
      email: 'demo@pricepilot.com',
      passwordHash: 'password123'
    });
    console.log('Created User: demo@pricepilot.com / password123');

    // Create Product
    const product = await Product.create({
      url: 'https://www.amazon.com/dp/B09G9FPHY6',
      title: 'Apple iPad Mini (6th Gen)',
      brand: 'Apple',
      imageUrl: 'https://m.media-amazon.com/images/I/71vwVRNdQBL._AC_SX679_.jpg',
      currency: 'USD',
      source: 'amazon.com'
    });

    // Create Observations (History)
    await PriceObservation.create({ product: product._id, priceAmount: 499, currency: 'USD', observedAt: new Date(Date.now() - 5 * 24*60*60*1000), sourceType: 'manual' });
    await PriceObservation.create({ product: product._id, priceAmount: 479, currency: 'USD', observedAt: new Date(Date.now() - 3 * 24*60*60*1000), sourceType: 'manual' });
    await PriceObservation.create({ product: product._id, priceAmount: 459, currency: 'USD', observedAt: new Date(), sourceType: 'manual' });

    // Create Watchlist Item
    await WatchlistItem.create({
      user: user._id,
      product: product._id,
      targetPrice: 400
    });
    
    console.log('Seeded Products and Watchlist');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
