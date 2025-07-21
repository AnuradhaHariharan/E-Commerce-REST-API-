const pool = require('../config/db');

const createOrder = async (userId, items) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Insert into orders table
    const orderRes = await client.query(
      'INSERT INTO orders (user_id) VALUES ($1) RETURNING id',
      [userId]
    );

    const orderId = orderRes.rows[0].id;

    // Insert each item into order_items
    for (const item of items) {
      const { productId, quantity } = item;
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity) VALUES ($1, $2, $3)',
        [orderId, productId, quantity]
      );
    }

    await client.query('COMMIT');
    return orderId;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

const getUserOrders = async (userId) => {
  const res = await pool.query(
    `SELECT o.id as order_id, o.created_at, 
            json_agg(json_build_object('product_id', p.id, 'name', p.name, 'price', p.price, 'quantity', oi.quantity)) as items
     FROM orders o
     JOIN order_items oi ON o.id = oi.order_id
     JOIN products p ON p.id = oi.product_id
     WHERE o.user_id = $1
     GROUP BY o.id
     ORDER BY o.created_at DESC`,
    [userId]
  );

  return res.rows;
};

module.exports = {
  createOrder,
  getUserOrders
};
