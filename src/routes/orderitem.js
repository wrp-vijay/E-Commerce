const express = require('express');
const router = express.Router();
const orderitemController = require('../controller/orderitem');

// Create a new order item
router.post('/orderitems', orderitemController.createOrderitem);

// Retrieve all order items
router.get('/orderitems', orderitemController.getAllOrderitems);

// Retrieve a single order item by ID
router.get('/orderitems/:id', orderitemController.getOrderitemById);

// Update an order item by ID
router.put('/orderitems/:id', orderitemController.updateOrderitem);

// Delete an order item by ID
router.delete('/orderitems/:id', orderitemController.deleteOrderitem);

module.exports = router;
