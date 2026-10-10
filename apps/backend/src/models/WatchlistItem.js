const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const WatchlistItem = sequelize.define('WatchlistItem', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: false },
  productId: { type: DataTypes.UUID, allowNull: false },
  targetPrice: { type: DataTypes.FLOAT, defaultValue: 0 }
});

module.exports = WatchlistItem;
