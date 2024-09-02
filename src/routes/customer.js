const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const customerController = require('../controller/customer');
const { customerSchema } = require('../helper/validationSchemas');
const validate = require('../middleware/validation');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20
});

router.post('/customers', validate(customerSchema), limiter, customerController.createCustomer);
router.get('/customers', limiter, customerController.getCustomers);
router.get('/customers/:id', limiter, customerController.getCustomerById);
router.put('/customers/:id', validate(customerSchema), limiter, customerController.updateCustomer);
router.delete('/customers/:id', limiter, customerController.deleteCustomer);

module.exports = router;
