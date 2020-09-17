import Sequelize, { Model } from 'sequelize';
import Order from './Order';

class DeliveryProblems extends Model {
  static init(sequelize) {
    super.init(
      {
        delivery_id: Sequelize.INTEGER,
        description: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    DeliveryProblems.belongsTo(Order, {
      as: 'problems',
      foreignKey: 'order_id',
    });
    Order.hasOne(DeliveryProblems);
    return this;
  }
}
export default DeliveryProblems;
