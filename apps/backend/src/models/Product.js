const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  url: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  brand: { type: String },
  identifier: { type: String }, // GTIN/ASIN/SKU
  imageUrl: { type: String },
  currency: { type: String, required: true, default: 'USD' },
  source: { type: String, required: true }, // domain/store
  extractionStatus: { 
    type: String, 
    enum: ['pending', 'success', 'failed'], 
    default: 'pending' 
  },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
