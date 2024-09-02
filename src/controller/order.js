const { Order, Customer, Orderitem, product, sequelize } = require('../models');
const { Op } = require('sequelize');
const logger = require('../helper/logger');
const { DATA_NOT_FOUND, PRODUCT_CREATE, FAIELD_QUERY, DATA_GET_SUCCESFULLY, DATA_UPDATE, DATA_DELETE } = require('../helper/message');

exports.createOrder = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { customer_id, order_date, total_amount, items } = req.body;

    // Validate items
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: true, msg: 'Items array is required and cannot be empty' });
    }


    // Create the Order
    const newOrder = await Order.create({
      customer_id,
      order_date,
      total_amount
    }, { transaction: t });

    // Create the Order Items
    for (const item of items) {
      const { product_id, quantity } = item;

      // Fetch the product to get its price
      const products = await product.findByPk(product_id); // Corrected from 'products' to 'product'

      if (!products) {
        await t.rollback();
        return res.status(404).json({ error: true, msg: `Product with id ${product_id} not found` });
      }

      const price = products.price; // Access the price from the fetched product

      console.log(price);
      await Orderitem.create({
        OrderId: newOrder.id, // Corrected from 'OrderId' to 'order_id'
        product_id,
        quantity,
        price
      }, { transaction: t });
    }

    await t.commit();

    res.status(201).json({ error: false, msg: 'Order created successfully', data: newOrder });
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ error: true, msg: 'Failed to create order', error: error.message });
  }
};


exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.findAll();
        if (!orders || orders.length === 0) {
            return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
        }
        res.status(200).json({ error: false, msg: DATA_GET_SUCCESFULLY, data: orders });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: true, msg: FAILED_QUERY, error: error.message });
    }
};

// Retrieve a specific order by ID  
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);
        if (!order) {
            return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
        }
        res.status(200).json({ error: false, msg: DATA_GET_SUCCESFULLY, data: order });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
    }
};

// Retrieve all orders along with customer details
exports.getWithCustomerDetails = async (req, res) => {
    console.log("hello");
    try {
        // Perform a join operation to get orders along with customer details
        const ordersWithCustomerDetails = await Order.findAll({
            include: [
                {
                    model: Customer, // Include the Customer model
                    attributes: ['name'] // Specify which attributes to include from the Customer model
                }
            ]
        });

        // Check if no orders are found
        if (!ordersWithCustomerDetails || ordersWithCustomerDetails.length === 0) {
            return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
        }

        // Return the orders along with customer details
        res.status(200).json({ error: false, msg: DATA_GET_SUCCESFULLY, data: ordersWithCustomerDetails });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
    }
};

exports.getOrdersWithProductsByPrice = async (req, res) => {
    try {
        const { minPrice } = req.query;

        if (!minPrice) {
            return res.status(400).json({ error: true, msg: 'minPrice parameter is required' });
        }

        const ordersWithProducts = await Order.findAll({
            where: {
                total_amount: {
                    [Op.gt]: minPrice
                }   
            }
        });

        if (!ordersWithProducts || ordersWithProducts.length === 0) {
            return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
        }

        res.status(200).json({ error: false, msg: DATA_GET_SUCCESFULLY, data: ordersWithProducts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
    }
};

exports.calculateTotalRevenue = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Query orders within the specified time period
    const orders = await Order.findAll({
      where: {
        order_date: {
          [Op.between]: [startDate, endDate] // Assuming 'order_date' is the name of the column storing the order date
        }
      }
    });

    // Calculate total revenue
    let totalRevenue = 0;
    orders.forEach(order => {
      totalRevenue += order.total_amount;
    });

    res.status(200).json({ error: false, msg: 'Total sales revenue calculated successfully', totalRevenue });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, msg: 'Failed to calculate total sales revenue', error: error.message });
  }
};


// Update a specific order by ID
exports.updateOrder = async (req, res) => {
    const transaction = await Order.sequelize.transaction();
    try {
        const { customer_id, order_date, total_amount } = req.body;

        const order = await Order.findByPk(req.params.id);
        if (!order) {
            await transaction.rollback();
            return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
        }

        order.customer_id = customer_id;
        order.order_date = order_date;
        order.total_amount = total_amount;

        await order.save({ transaction });
        await transaction.commit();

        res.status(200).json({ error: false, msg: DATA_UPDATE });

    } catch (error) {
        await transaction.rollback();
        logger.error(error);
        res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
    }
};

// Delete a specific order by ID
exports.deleteOrder = async (req, res) => {
    const transaction = await Order.sequelize.transaction();
    try {
        const order = await Order.findByPk(req.params.id);
        if (!order) {
            await transaction.rollback();
            return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
        }

        await order.destroy({ transaction });
        await transaction.commit();

        res.status(200).json({ error: false, msg: DATA_DELETE });
    } catch (error) {
        await transaction.rollback();
        logger.error(error);
        res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
    }
};
