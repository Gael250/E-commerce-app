 const db = require('../config/db');

// 1. PLACE ORDER
exports.placeOrder = async (req, res) => {
    const userId = req.user.id;

    try {
        // Get cart items
        const [cartItems] = await db.query(
            `SELECT c.product_id, c.quantity, p.price 
             FROM cart_items c
             JOIN products p ON c.product_id = p.id
             WHERE c.cart_id = (
                SELECT id FROM cart WHERE user_id = ?
             )`,
            [userId]
        );

        if (cartItems.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        // Calculate total price
        const total = cartItems.reduce((sum, item) => {
            return sum + item.quantity * item.price;
        }, 0);

        // Create order
        const [orderResult] = await db.query(
            "INSERT INTO orders (user_id, total_price, status) VALUES (?, ?, 'pending')",
            [userId, total]
        );

        const orderId = orderResult.insertId;

        // Insert into order_items
        for (let item of cartItems) {
            await db.query(
                `INSERT INTO order_items (order_id, product_id, quantity, price)
                 VALUES (?, ?, ?, ?)`,
                [orderId, item.product_id, item.quantity, item.price]
            );
        }

        // Clear cart
        await db.query(
            `DELETE FROM cart_items 
             WHERE cart_id = (SELECT id FROM cart WHERE user_id = ?)`,
            [userId]
        );

        res.status(201).json({ message: "Order placed successfully", orderId });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// 2. GET MY ORDERS
exports.getMyOrders = async (req, res) => {
    const userId = req.user.id;

    try {
        const [orders] = await db.query(
            "SELECT * FROM orders WHERE user_id = ?",
            [userId]
        );

        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// 3. GET ORDER BY ID
exports.getOrderById = async (req, res) => {
    const orderId = req.params.id;
    const userId = req.user.id;

    try {
        const [orders] = await db.query(
            "SELECT * FROM orders WHERE id = ? AND user_id = ?",
            [orderId, userId]
        );

        if (orders.length === 0) {
            return res.status(404).json({ message: "Order not found" });
        }

        const [items] = await db.query(
            "SELECT * FROM order_items WHERE order_id = ?",
            [orderId]
        );

        res.json({ order: orders[0], items });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// 4. UPDATE ORDER STATUS (ADMIN)
exports.updateOrderStatus = async (req, res) => {
    const orderId = req.params.id;
    const { status } = req.body;

    try {
        await db.query(
            "UPDATE orders SET status = ? WHERE id = ?",
            [status, orderId]
        );

        res.json({ message: "Order status updated" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};