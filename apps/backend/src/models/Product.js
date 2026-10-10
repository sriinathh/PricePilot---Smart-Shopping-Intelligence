const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Product = sequelize.define('Product', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  url: { type: DataTypes.STRING, allowNull: false, unique: true },
  domain: { type: DataTypes.STRING },
  imageUrl: { type: DataTypes.STRING },
  identifier: { type: DataTypes.STRING },
  brand: { type: DataTypes.STRING }
});

module.exports = Product;
