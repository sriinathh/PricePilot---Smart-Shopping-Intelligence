const express = require('express');
const { resolveProduct, getProductHistory } = require('../controllers/productController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Publicly resolve product logic
router.post('/resolve', resolveProduct);

// Get price history for a specific product
router.get('/:id/history', protect, getProductHistory);

module.exports = router;
