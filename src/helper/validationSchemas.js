const Joi = require('joi');

const productSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    price:  Joi.number().integer().required(),
    quantity:  Joi.number().integer().required(),
});

const customerSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    address: Joi.string().required()
});

const orderSchema = Joi.object({
    customer_id: Joi.number().integer().required(),
    order_date: Joi.date().required(),
    total_amount: Joi.number().integer().required(),
    items: Joi.array().items(
        Joi.object({
          product_id: Joi.number().required(),
          quantity: Joi.number().required(),
        })
      ).required()
});

const orderitemSchema = Joi.object({
    product_id: Joi.number().integer().required(),
    quantity: Joi.number().integer().required(),
});

module.exports ={
    productSchema,
    customerSchema,
    orderSchema,
    orderitemSchema
}