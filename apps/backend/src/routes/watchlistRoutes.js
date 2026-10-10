const express = require('express');
const { getWatchlist, addToWatchlist, deleteItem, updateItem } = require('../controllers/watchlistController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, getWatchlist)
  .post(protect, addToWatchlist);

router.route('/:id')
  .delete(protect, deleteItem)
  .put(protect, updateItem);

module.exports = router;
