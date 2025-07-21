const Order = require('../models/orderModel');

const placeOrder = async (req, res) => {
  const userId = req.user.id;
  const { items } = req.body; // [{ productId, quantity }]

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'No items provided' });
  }

  try {
    const orderId = await Order.createOrder(userId, items);
    res.status(201).json({ message: 'Order placed', orderId });
  } catch (err) {
    res.status(500).json({ error: 'Error placing order' });
  }
};

const getOrders = async (req, res) => {
  const userId = req.user.id;

  try {
    const orders = await Order.getUserOrders(userId);
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching orders' });
  }
};

module.exports = {
  placeOrder,
  getOrders
};
