const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFilteredProducts
} = require('../controllers/productController');

// Public Routes
router.get('/filter',getFilteredProducts);
router.get('/', getAllProducts);
router.get('/:id', getProductById);


// Protected Routes
router.post('/', authMiddleware, upload.single('image'), createProduct);
router.put('/:id', authMiddleware, updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);



module.exports = router;
