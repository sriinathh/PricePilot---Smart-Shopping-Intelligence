const mongoose = require('mongoose');

const priceObservationSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  priceAmount: { type: Number, required: true },
  currency: { type: String, required: true },
  availability: { type: Boolean, default: true },
  observedAt: { type: Date, default: Date.now },
  sourceType: { type: String, enum: ['browser_extension', 'backend_job', 'manual'], required: true },
  sourceReference: { type: String }, // e.g. user ID if manual or extension
  validationStatus: { type: String, enum: ['unverified', 'verified', 'flagged'], default: 'unverified' }
});

module.exports = mongoose.model('PriceObservation', priceObservationSchema);
