const PriceAlert = require('../models/PriceAlert');
const WatchlistItem = require('../models/WatchlistItem');
const Product = require('../models/Product');

exports.createAlert = async (req, res) => {
  try {
    const { watchlistItemId, targetPrice, alertType } = req.body;

    const watchlistItem = await WatchlistItem.findOne({ _id: watchlistItemId, user: req.user.id });
    if (!watchlistItem) {
      return res.status(404).json({ success: false, error: 'Watchlist item not found' });
    }

    const alert = await PriceAlert.create({
      user: req.user.id,
      watchlistItem: watchlistItem._id,
      targetPrice: targetPrice || watchlistItem.targetPrice,
      alertType: alertType || 'target_reached'
    });

    res.status(201).json({ success: true, data: alert });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAlerts = async (req, res) => {
  try {
    const alerts = await PriceAlert.find({ user: req.user.id })
      .populate({
        path: 'watchlistItem',
        populate: { path: 'product' }
      });
      
    res.status(200).json({ success: true, data: alerts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
