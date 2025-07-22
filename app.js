const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const productRoutes = require('./routes/product');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/order');
const categoryRoutes = require('./routes/categoryRoutes');
const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("API is running");
});
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);

module.exports = app;
