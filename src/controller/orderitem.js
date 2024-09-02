const { DATA_ISERT_SUCCESFULLY, FAIELD_QUERY, DATA_GET_SUCCESFULLY, DATA_DELETE, DATA_NOT_FOUND, DATA_UPDATE } = require('../helper/message');
const { Orderitem, Order, product } = require('../models');
const orderitem = require('../models/orderitem');

// Create a new order item
exports.createOrderitem = async (req, res) => {
  try {
    const { OrderId, product_id, quantity, price } = req.body;
    const newOrderitem = await Orderitem.create({ OrderId, product_id, quantity, price });
    res.status(201).json({ error: false, msg: DATA_ISERT_SUCCESFULLY, data: newOrderitem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
  }
};

// Retrieve all order items
exports.getAllOrderitems = async (req, res) => {
  try {
    const orderitems = await Orderitem.findAll({
      include: [
        { model: Order, attributes: ['id', 'order_date', 'total_amount'] },
        { model: product, attributes: ['name', 'price'] }
      ]
    });
    res.status(200).json({ error: false, msg: DATA_GET_SUCCESFULLY, data: orderitems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
  }
};

// Retrieve a single order item by ID
exports.getOrderitemById = async (req, res) => {
  try {
    const { id } = req.params;
    const orderitem = await Orderitem.findByPk(id, {
      include: [
        { model: Order, attributes: ['id', 'order_date', 'total_amount'] },
        { model: product, attributes: ['name', 'price'] }
      ]
    });
    if (!orderitem) {
      return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
    }
    res.status(200).json({ error: false, msg: DATA_GET_SUCCESFULLY, data: orderitem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
  }
};

// Update an order item by ID
exports.updateOrderitem = async (req, res) => {
    const transaction = await Orderitem.sequelize.transaction();
  try {
    const { id } = req.params;
    const { order_id, product_id, quantity, price } = req.body;
    const orderitem = await Orderitem.findByPk(id);
    if (!orderitem) {
        await transaction.rollback();
      return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
    }
    await orderitem.update({ order_id, product_id, quantity, price }, { transaction });
    await transaction.commit();
    res.status(200).json({ error: false, msg: DATA_UPDATE, data: orderitem });
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
  }
};

// Delete an order item by ID
exports.deleteOrderitem = async (req, res) => {
    const transaction = await Order.sequelize.transaction();
  try {
    const { id } = req.params;
    const orderitem = await Orderitem.findByPk(id);
    if (!orderitem) {
        await transaction.commit();
      return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
    }
    await orderitem.destroy({ transaction });
    await transaction.commit();
    res.status(200).json({ error: false, msg: DATA_DELETE });
  } catch (error) {
    await transaction.rollback();

    console.error(error);
    res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
  }
};
