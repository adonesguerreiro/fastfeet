import Sequelize, { Model } from 'sequelize';
import Order from './Order';

class DeliveryProblem extends Model {
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

    DeliveryProblem.belongsTo(Order, {
      as: 'deliveryproblems',
      foreignKey: 'delivery_id',
    });

    return this;
  }
}
export default DeliveryProblem;
