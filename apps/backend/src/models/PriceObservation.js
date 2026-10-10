const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const PriceObservation = sequelize.define('PriceObservation', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  productId: { type: DataTypes.UUID, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  currency: { type: DataTypes.STRING, defaultValue: 'USD' },
  isAvailable: { type: DataTypes.BOOLEAN, defaultValue: true },
  condition: { type: DataTypes.STRING, defaultValue: 'new' }
});

module.exports = PriceObservation;
