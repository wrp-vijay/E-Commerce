'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class product extends Model {
    
    static associate(models) {
      // define association here
      product.belongsToMany(models.Order, { through: 'Orderitem', foreignKey: 'product_id' });
    }
  }
  product.init({
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'product',
  });
  return product;
};