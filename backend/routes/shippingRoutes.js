// routes/shippingRoutes.js - Shipping routes

const express = require('express');
const router = express.Router();
const {
  calculateShipping,
  getShippingMethods
} = require('../controllers/shippingController');

router.post('/calculate', calculateShipping);
router.get('/methods', getShippingMethods);

module.exports = router;
