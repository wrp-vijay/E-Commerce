const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const productController = require('../controller/product');
const { productSchema } = require('../helper/validationSchemas');
const validate = require('../middleware/validation');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20
});

router.post('/products', validate(productSchema), limiter, productController.createProduct);
router.get('/products', limiter, productController.getProducts);
router.get('/products/:id', limiter, productController.getProductById);
router.patch('/products/maxQuantity', limiter, productController.getProductsByMaxQuantity);
router.patch('/products/order',limiter, productController.getProductsWithOrderItems);
router.put('/products/:id', limiter, productController.updateProduct);
router.delete('/products/:id', limiter, productController.deleteProduct);

module.exports = router;
