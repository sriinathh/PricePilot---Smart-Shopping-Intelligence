const { sequelize, connectDB } = require('../config/db');

const User = require('./User');
const Product = require('./Product');
const WatchlistItem = require('./WatchlistItem');
const PriceAlert = require('./PriceAlert');
const PriceObservation = require('./PriceObservation');

// Define Relationships
User.hasMany(WatchlistItem, { foreignKey: 'userId', onDelete: 'CASCADE' });
WatchlistItem.belongsTo(User, { foreignKey: 'userId' });

Product.hasMany(WatchlistItem, { foreignKey: 'productId', onDelete: 'CASCADE' });
WatchlistItem.belongsTo(Product, { foreignKey: 'productId' });

User.hasMany(PriceAlert, { foreignKey: 'userId', onDelete: 'CASCADE' });
PriceAlert.belongsTo(User, { foreignKey: 'userId' });

WatchlistItem.hasMany(PriceAlert, { foreignKey: 'watchlistItemId', onDelete: 'CASCADE' });
PriceAlert.belongsTo(WatchlistItem, { foreignKey: 'watchlistItemId' });

Product.hasMany(PriceObservation, { foreignKey: 'productId', onDelete: 'CASCADE' });
PriceObservation.belongsTo(Product, { foreignKey: 'productId' });

module.exports = {
  sequelize,
  connectDB,
  User,
  Product,
  WatchlistItem,
  PriceAlert,
  PriceObservation
};
