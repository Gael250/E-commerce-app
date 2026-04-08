const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { authMiddleware } = require('../middleware/authMiddleware'); // Assume exports authMiddleware
const { uploadMiddleware } = require('../middleware/uploadMiddleware'); // Assume multer setup for single 'image'
const { validateMiddleware } = require('../middleware/validateMiddleware'); // Assume validators

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Admin protected routes
router.post('/', authMiddleware, uploadMiddleware.single('image'), createProduct);
router.put('/:id', authMiddleware, uploadMiddleware.single('image'), updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);

module.exports = router;
