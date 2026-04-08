const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');

// Define the placeOrder handler directly here
const placeOrder = (req, res) => {
  const { fullName, phone, street, city, status } = req.body;

  if (!fullName || !phone || !street || !city) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Simulate saving order and generate an orderId
  const orderId = Math.floor(Math.random() * 1000000);

  console.log("Order placed:", req.body);

  res.status(201).json({ orderId });
};

// Routes
// You can remove authMiddleware temporarily for testing if you want
router.post('/orders', authMiddleware, placeOrder);
router.get('/orders', authMiddleware, (req, res) => {
  // placeholder for getMyOrders logic
  res.send('Get My Orders');
});
router.get('/orders/:id', authMiddleware, (req, res) => {
  // placeholder for getOrderById logic
  res.send(`Get order by ID: ${req.params.id}`);
});
router.put('/orders/:id/status', authMiddleware, (req, res) => {
  // placeholder for updateOrderStatus logic
  res.send(`Update order status for ID: ${req.params.id}`);
});

module.exports = router;