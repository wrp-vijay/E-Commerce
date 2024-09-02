const { product, Orderitem } = require('../models');
const { Op } = require('sequelize');
const logger = require('../helper/logger');
const { DATA_NOT_FOUND, DATA_ISERT_SUCCESFULLY, FAIELD_QUERY, DATA_GET_SUCCESFULLY, DATA_UPDATE, DATA_DELETE } = require('../helper/message');

exports.createProduct = async (req, res) => {
    const transaction = await product.sequelize.transaction();
    try {
        const { name, price, quantity } = req.body;

        const newProduct = await product.create({
            name,
            price,
            quantity
        }, { transaction });

        await transaction.commit();
        res.status(200).json({ error: false, msg: DATA_ISERT_SUCCESFULLY, data: newProduct });
    } catch (error) {
        await transaction.rollback();
        logger.error(error);
        res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
    }
}

exports.getProducts = async (req, res) => {
    try {
        const products = await product.findAll();
        if (!products || products.length === 0) {
            return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
        }
        res.status(200).json({ error: false, msg: DATA_GET_SUCCESFULLY, data: products });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
    }
};

exports.getProductsByMaxQuantity = async (req, res) => {
    try {
        const { maxQuantity } = req.query;

        if (!maxQuantity) {
            return res.status(400).json({ error: true, msg: 'maxQuantity parameter is required' });
        }

        const products = await product.findAll({
            where: {
                quantity: {
                    [Op.lt]: maxQuantity
                }
            }
        });

        if (!products || products.length === 0) {
            return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
        }

        res.status(200).json({ error: false, msg: DATA_GET_SUCCESFULLY, data: products });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
    }
};

// Get a list of products with their corresponding orders
exports.getProductsWithOrderItems = async (req, res) => {
    try {
        const productsWithOrderItems = await Orderitem.findAll({
            include: [
                {
                    model: product,
                    attributes: ['quantity'] // Include the attributes you want from the Orderitem model
                }
            ]
        });

        res.status(200).json({ error: false, msg: 'Products with order items retrieved successfully', data: productsWithOrderItems });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: true, msg: 'Failed to retrieve products with order items', error: error.message });
    }
};


exports.getProductById = async (req, res) => {
    try {
        const products = await product.findByPk(req.params.id);
        if (!products) {
            return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
        }
        res.status(200).json({ error: false, msg: DATA_GET_SUCCESFULLY, data: products });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    const transaction = await product.sequelize.transaction();
    try {
        const { name, price, quantity } = req.body;

        const productInstance = await product.findByPk(req.params.id, { transaction });
        if (!productInstance) {
            await transaction.rollback();
            return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
        }

        productInstance.name = name;
        productInstance.price = price;
        productInstance.quantity = quantity;

        await productInstance.save({ transaction });
        await transaction.commit();

        res.status(200).json({ error: false, msg: DATA_UPDATE });

    } catch (error) {
        await transaction.rollback();
        logger.error(error);
        res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
    }
};


exports.deleteProduct = async (req, res) => {
    const transaction = await product.sequelize.transaction();
    try {
        const products = await product.findByPk(req.params.id, { transaction });
        if (!products) {
            await transaction.rollback();
            return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
        }

        await product.destroy({ transaction });
        await transaction.commit();

        res.status(200).json({ error: false, msg: DATA_DELETE });
    } catch (error) {
        await transaction.rollback();
        logger.error(error);
        res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
    }
};
