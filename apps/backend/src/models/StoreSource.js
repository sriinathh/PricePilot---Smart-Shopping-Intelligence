const mongoose = require('mongoose');

const storeSourceSchema = new mongoose.Schema({
  domain: { type: String, required: true, unique: true },
  adapterName: { type: String, required: true },
  supportedFeatures: [{ type: String }],
  dataCollectionMethod: { type: String, enum: ['browser_extension', 'api', 'scrape'], default: 'browser_extension' },
  enabledStatus: { type: Boolean, default: true },
  lastSuccessfulCheck: { type: Date },
  lastError: { type: String }
});

module.exports = mongoose.model('StoreSource', storeSourceSchema);
