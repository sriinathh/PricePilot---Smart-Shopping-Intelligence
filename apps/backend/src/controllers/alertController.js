const { PriceAlert, WatchlistItem, Product } = require('../models');

exports.getAlerts = async (req, res) => {
  try {
    const alerts = await PriceAlert.findAll({
      where: { userId: req.user.id },
      include: [{
        model: WatchlistItem,
        include: [Product]
      }]
    });
    
    // Map to Mongoose format
    const formatted = alerts.map(alert => ({
      _id: alert.id,
      targetPrice: alert.targetPrice,
      status: alert.status,
      createdAt: alert.createdAt,
      watchlistItem: {
        product: {
          title: alert.WatchlistItem.Product.title,
          imageUrl: alert.WatchlistItem.Product.imageUrl,
          url: alert.WatchlistItem.Product.url
        }
      }
    }));

    res.status(200).json({ success: true, data: formatted });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
