const mongoose = require('mongoose');

const watchlistItemSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  targetPrice: { type: Number },
  trackingStatus: { type: String, enum: ['active', 'paused', 'archived'], default: 'active' }
}, { timestamps: true });

// Ensure a user can only watch a product once
watchlistItemSchema.index({ user: 1, product: 1 }, { unique: true });

module.exports = mongoose.model('WatchlistItem', watchlistItemSchema);
