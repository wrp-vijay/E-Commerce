'use strict';

const { Customer } = require('../models');
const logger = require('../helper/logger');
const { DATA_NOT_FOUND, DATA_ISERT_SUCCESFULLY, FAIELD_QUERY, DATA_GET_SUCCESFULLY, DATA_UPDATE, DATA_DELETE } = require('../helper/message');

exports.createCustomer = async (req, res) => {
    const transaction = await Customer.sequelize.transaction();
    try {
        const { name, email, address } = req.body;
        const newCustomer = await Customer.create({
            name,
            email,
            address
        }, { transaction });

        await transaction.commit();
        res.status(200).json({ error: false, msg: DATA_ISERT_SUCCESFULLY, data: newCustomer });
    } catch (error) {
        await transaction.rollback();
        logger.error(error);
        res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
    }
};

exports.getCustomers = async (req, res) => {
    try {
        const customers = await Customer.findAll();
        if (!customers || customers.length === 0) {
            return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
        }
        res.status(200).json({ error: false, msg: DATA_GET_SUCCESFULLY, data: customers });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
    }
};

exports.getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findByPk(req.params.id);
        if (!customer) {
            return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
        }
        res.status(200).json({ error: false, msg: DATA_GET_SUCCESFULLY, data: customer });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
    }
};

exports.updateCustomer = async (req, res) => {
    const transaction = await Customer.sequelize.transaction();
    try {
        const { name, email, address } = req.body;

        const customer = await Customer.findByPk(req.params.id);
        if (!customer) {
            await transaction.rollback();
            return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
        }

        customer.name = name;
        customer.email = email;
        customer.address = address;

        await customer.save({ transaction });
        await transaction.commit();

        res.status(200).json({ error: false, msg: DATA_UPDATE });

    } catch (error) {
        logger.error(error);
        await transaction.rollback();
        res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
    }
};

exports.deleteCustomer = async (req, res) => {
    const transaction = await Customer.sequelize.transaction();
    try {
        const customer = await Customer.findByPk(req.params.id);
        if (!customer) {
            await transaction.rollback();
            return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
        }

        await customer.destroy({ transaction });
        await transaction.commit();

        res.status(200).json({ error: false, msg: DATA_DELETE });
    } catch (error) {
        await transaction.rollback();
        logger.error(error);
        res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
    }
};
