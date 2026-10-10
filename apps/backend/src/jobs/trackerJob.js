const WatchlistItem = require('../models/WatchlistItem');
const PriceObservation = require('../models/PriceObservation');
const PriceAlert = require('../models/PriceAlert');
const Product = require('../models/Product');

/**
 * Mock scheduled tracker. In a real environment, this would run on a cron,
 * query supported retailer APIs, update PriceObservations, and trigger Alerts.
 */
const startTracker = () => {
  console.log('Background Price Tracker initialized. (Mocking scheduled checks)');
  
  setInterval(async () => {
    // This runs every 10 minutes in a real app, currently simplified for MVP test
    try {
      // Find active alerts
      const pendingAlerts = await PriceAlert.find({ status: 'pending' }).populate('watchlistItem');
      
      for (let alert of pendingAlerts) {
        // Query latest observation for this product
        const latestObs = await PriceObservation.findOne({ product: alert.watchlistItem.product })
          .sort({ observedAt: -1 });

        if (latestObs && latestObs.priceAmount <= alert.targetPrice) {
          // Trigger the alert
          alert.status = 'triggered';
          alert.triggeringObservation = latestObs._id;
          await alert.save();
          console.log(`Alert triggered for User ${alert.user}: Price reached ${latestObs.priceAmount}`);
          // Send Email / Push logic goes here
        }
      }
    } catch (err) {
      console.error('Tracker error:', err.message);
    }
  }, 1000 * 60 * 10); // Run every 10 mins
};

module.exports = startTracker;
