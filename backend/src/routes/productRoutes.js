const express = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const validate = require('../middleware/validate');
const { productValidator } = require('../validators/productValidator');

const router = express.Router();

router.route('/').get(getProducts).post(validate(productValidator),createProduct);
router.route('/:id').get(getProductById).patch(updateProduct).delete(deleteProduct);

module.exports = router;
