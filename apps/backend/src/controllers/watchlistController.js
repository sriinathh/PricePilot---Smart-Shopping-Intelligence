const { WatchlistItem, Product, PriceAlert } = require('../models');

exports.getWatchlist = async (req, res) => {
  try {
    const items = await WatchlistItem.findAll({
      where: { userId: req.user.id },
      include: [Product],
      order: [['createdAt', 'DESC']]
    });
    // Format to match old Mongoose output for frontend compatibility
    const formatted = items.map(item => ({
      _id: item.id,
      targetPrice: item.targetPrice,
      createdAt: item.createdAt,
      product: {
        _id: item.Product.id,
        title: item.Product.title,
        url: item.Product.url,
        imageUrl: item.Product.imageUrl,
        brand: item.Product.brand
      }
    }));
    res.status(200).json({ success: true, count: formatted.length, data: formatted });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.addToWatchlist = async (req, res) => {
  try {
    const { productId, targetPrice } = req.body;
    const item = await WatchlistItem.create({
      userId: req.user.id,
      productId: productId,
      targetPrice: targetPrice || 0
    });

    if (targetPrice && targetPrice > 0) {
      await PriceAlert.create({
        userId: req.user.id,
        watchlistItemId: item.id,
        targetPrice: targetPrice
      });
    }

    res.status(201).json({ success: true, data: { _id: item.id } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const item = await WatchlistItem.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!item) return res.status(404).json({ success: false, error: 'Item not found' });
    
    await PriceAlert.destroy({ where: { watchlistItemId: item.id } });
    await item.destroy();
    
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { targetPrice } = req.body;
    const item = await WatchlistItem.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!item) return res.status(404).json({ success: false, error: 'Not found' });
    
    item.targetPrice = targetPrice;
    await item.save();
    
    if (targetPrice > 0) {
      const [alert, created] = await PriceAlert.findOrCreate({
        where: { watchlistItemId: item.id, userId: req.user.id },
        defaults: { targetPrice, status: 'pending' }
      });
      if (!created) {
        alert.targetPrice = targetPrice;
        alert.status = 'pending';
        await alert.save();
      }
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
