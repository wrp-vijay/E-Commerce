const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const orderController = require('../controller/order');
const { orderSchema } = require('../helper/validationSchemas');
const validate = require('../middleware/validation');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20
});

router.post('/orders',validate(orderSchema), limiter,  orderController.createOrder);
router.get('/orders',limiter, orderController.getOrders);
router.get('/orders/:id',limiter, orderController.getOrderById);
router.patch('/orders/minPrice',limiter, orderController.getOrdersWithProductsByPrice);
router.patch('/orders/customer',limiter, orderController.getWithCustomerDetails);
router.patch('/total-revenue',limiter, orderController.calculateTotalRevenue);
router.put('/orders/:id',validate(orderSchema), limiter, orderController.updateOrder);
router.delete('/orders/:id',limiter, orderController.deleteOrder);

module.exports = router;
