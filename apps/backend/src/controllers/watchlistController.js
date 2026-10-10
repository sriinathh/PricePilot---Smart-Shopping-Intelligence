const WatchlistItem = require('../models/WatchlistItem');
const Product = require('../models/Product');
const PriceAlert = require('../models/PriceAlert');

exports.getWatchlist = async (req, res) => {
  try {
    const items = await WatchlistItem.find({ user: req.user.id })
      .populate('product')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.addToWatchlist = async (req, res) => {
  try {
    const { productId, targetPrice } = req.body;
    const item = await WatchlistItem.create({
      user: req.user.id,
      product: productId,
      targetPrice: targetPrice || 0
    });

    // Automatically create a PriceAlert if a target price is set
    if (targetPrice && targetPrice > 0) {
      await PriceAlert.create({
        user: req.user.id,
        watchlistItem: item._id,
        targetPrice: targetPrice
      });
    }

    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const item = await WatchlistItem.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }
    // Also delete associated alert
    await PriceAlert.deleteMany({ watchlistItem: req.params.id });
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { targetPrice } = req.body;
    const item = await WatchlistItem.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { targetPrice },
      { new: true }
    );
    if (!item) return res.status(404).json({ success: false, error: 'Not found' });
    
    if (targetPrice > 0) {
      await PriceAlert.findOneAndUpdate(
        { watchlistItem: item._id, user: req.user.id },
        { targetPrice, status: 'pending' },
        { upsert: true, new: true }
      );
    }
    
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
