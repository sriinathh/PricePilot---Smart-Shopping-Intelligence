const mongoose = require('mongoose');

const priceAlertSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  watchlistItem: { type: mongoose.Schema.Types.ObjectId, ref: 'WatchlistItem', required: true },
  alertType: { type: String, enum: ['target_reached', 'price_drop'], default: 'target_reached' },
  targetPrice: { type: Number },
  triggeringObservation: { type: mongoose.Schema.Types.ObjectId, ref: 'PriceObservation' },
  status: { type: String, enum: ['pending', 'triggered', 'delivered', 'failed'], default: 'pending' },
  deliveredAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('PriceAlert', priceAlertSchema);
