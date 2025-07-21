const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { placeOrder, getOrders } = require('../controllers/orderController');

router.post('/', authMiddleware, placeOrder);
router.get('/', authMiddleware, getOrders);

module.exports = router;
