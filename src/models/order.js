// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class Order extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   }
//   Order.init({
//     customer_id: DataTypes.INTEGER,
//     order_date: DataTypes.DATE,
//     total_amount: DataTypes.INTEGER
//   }, {
//     sequelize,
//     modelName: 'Order',
//   });
//   return Order;
// };

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      // Define association with Customer model
      Order.belongsTo(models.Customer, { foreignKey: 'customer_id' });
      Order.hasMany(models.Orderitem, { foreignKey: 'OrderId' }); // Ensure correct association for Orderitems

    }
  }
  Order.init({
    customer_id: DataTypes.INTEGER,
    order_date: DataTypes.DATE, 
    total_amount: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};

