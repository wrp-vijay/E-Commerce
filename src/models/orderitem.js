'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Orderitem extends Model {
    static associate(models) {
      Orderitem.belongsTo(models.Order, { foreignKey: 'OrderId' });
      Orderitem.belongsTo(models.product, { foreignKey: 'product_id' });
    }
  }
  Orderitem.init({
    OrderId: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    price: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Orderitem',
  });
  return Orderitem;
};