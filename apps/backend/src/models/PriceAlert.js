const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const PriceAlert = sequelize.define('PriceAlert', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: false },
  watchlistItemId: { type: DataTypes.UUID, allowNull: false },
  alertType: { type: DataTypes.STRING, defaultValue: 'target_reached' },
  targetPrice: { type: DataTypes.FLOAT },
  status: { type: DataTypes.STRING, defaultValue: 'pending' },
  deliveredAt: { type: DataTypes.DATE }
});

module.exports = PriceAlert;
