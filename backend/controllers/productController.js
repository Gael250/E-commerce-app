const db = require('../config/db');
const fs = require('fs').promises;
const path = require('path');

// Helper function to handle errors
const sendError = (res, status, message) => {
  return res.status(status).json({ error: message });
};

// GET /api/products - Get all products with optional filters
const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.q || '';
    const categoryId = req.query.category_id ? parseInt(req.query.category_id) : null;

    let query = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.is_active = 1 
    `;
    let queryParams = [];

    if (search) {
      query += ` AND (p.name LIKE ? OR p.description LIKE ?)`;
      queryParams.push(`%${search}%`, `%${search}%`);
    }
    if (categoryId) {
      query += ` AND p.category_id = ?`;
      queryParams.push(categoryId);
    }

    query += ` ORDER BY p.created_at DESC LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);

    const [products] = await db.promise().query(query, queryParams);

    // Get total count for pagination
    let countQuery = `SELECT COUNT(*) as total FROM products p WHERE p.is_active = 1`;
    let countParams = [];
    if (search) {
      countQuery += ` AND (p.name LIKE ? OR p.description LIKE ?)`;
      countParams.push(`%${search}%`, `%${search}%`);
    }
    if (categoryId) {
      countQuery += ` AND p.category_id = ?`;
      countParams.push(categoryId);
    }
    const [[{ total }]] = await db.promise().query(countQuery, countParams);

    res.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    sendError(res, 500, 'Server error while fetching products');
  }
};

// GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const [product] = await db.promise().query(
      `SELECT p.*, c.name as category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.id = ? AND p.is_active = 1`,
      [id]
    );

    if (product.length === 0) {
      return sendError(res, 404, 'Product not found');
    }

    res.json(product[0]);
  } catch (error) {
    console.error('Get product error:', error);
    sendError(res, 500, 'Server error while fetching product');
  }
};

// POST /api/products - Create new product (admin)
const createProduct = async (req, res) => {
  try {
    const { name, sku, description, price, stock_quantity, category_id, is_active = 1 } = req.body;
    
    if (!name || !sku || !category_id || price == null || stock_quantity == null) {
      return sendError(res, 400, 'Missing required fields');
    }

    // Handle image upload
    let image_url = null;
    if (req.file) {
      const uploadDir = 'uploads/products';
      image_url = `${uploadDir}/${req.file.filename}`;
      // Ensure directory exists
      await fs.mkdir(path.join(__dirname, '..', uploadDir), { recursive: true });
      await fs.rename(req.file.path, path.join(__dirname, '..', image_url));
    }

    const [result] = await db.promise().query(
      `INSERT INTO products (category_id, name, sku, description, price, stock_quantity, image_url, is_active) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [category_id, name, sku, description || null, parseFloat(price), parseInt(stock_quantity), image_url, parseInt(is_active)]
    );

    res.status(201).json({ id: result.insertId, message: 'Product created successfully' });
  } catch (error) {
    console.error('Create product error:', error);
    sendError(res, 500, 'Server error while creating product');
  }
};

// PUT /api/products/:id - Update product (admin)
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updateFields = [];
    const params = [];

    // Build dynamic update query
    if (updates.name !== undefined) { updateFields.push('name = ?'); params.push(updates.name); }
    if (updates.sku !== undefined) { updateFields.push('sku = ?'); params.push(updates.sku); }
    if (updates.description !== undefined) { updateFields.push('description = ?'); params.push(updates.description); }
    if (updates.price !== undefined) { updateFields.push('price = ?'); params.push(parseFloat(updates.price)); }
    if (updates.stock_quantity !== undefined) { updateFields.push('stock_quantity = ?'); params.push(parseInt(updates.stock_quantity)); }
    if (updates.category_id !== undefined) { updateFields.push('category_id = ?'); params.push(parseInt(updates.category_id)); }
    if (updates.is_active !== undefined) { updateFields.push('is_active = ?'); params.push(parseInt(updates.is_active)); }

    // Handle image update
    if (req.file) {
      const uploadDir = 'uploads/products';
      const image_url = `${uploadDir}/${req.file.filename}`;
      updateFields.push('image_url = ?');
      params.push(image_url);
      await fs.mkdir(path.join(__dirname, '..', uploadDir), { recursive: true });
      await fs.rename(req.file.path, path.join(__dirname, '..', image_url));
    }

    if (updateFields.length === 0) {
      return sendError(res, 400, 'No fields to update');
    }

    params.push(parseInt(id));
    const query = `UPDATE products SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    const [result] = await db.promise().query(query, params);

    if (result.affectedRows === 0) {
      return sendError(res, 404, 'Product not found');
    }

    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Update product error:', error);
    sendError(res, 500, 'Server error while updating product');
  }
};

// DELETE /api/products/:id - Delete product (admin, soft delete)
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.promise().query(
      'UPDATE products SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return sendError(res, 404, 'Product not found');
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    sendError(res, 500, 'Server error while deleting product');
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
