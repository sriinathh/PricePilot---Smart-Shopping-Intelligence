const express = require('express');
const { createAlert, getAlerts } = require('../controllers/alertController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .post(protect, createAlert)
  .get(protect, getAlerts);

module.exports = router;
