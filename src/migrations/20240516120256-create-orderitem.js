'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orderitems', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      OrderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'order_id',
        references: {
          model: 'Orders', // Referencing the Orders table
          key: 'id' // Referencing the primary key 'id' in the Orders table
        },
        onUpdate: 'CASCADE', // Update the orderitems table if the corresponding order is updated
        onDelete: 'CASCADE', // Delete the orderitems if the corresponding order is deleted
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Products', // Referencing the Products table
          key: 'id' // Referencing the primary key 'id' in the Products table
        },
        onUpdate: 'CASCADE', // Update the orderitems table if the corresponding product is updated
        onDelete: 'CASCADE' // Delete the orderitems if the corresponding product is deleted
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false // Ensure the quantity is required
      },
      price: {
        type: Sequelize.FLOAT,
        allowNull: false // Ensure the price is required
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Orderitems');
  }
};
