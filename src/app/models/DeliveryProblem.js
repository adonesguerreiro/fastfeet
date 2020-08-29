import Sequelize, { Model } from 'sequelize';
import Recipient from './Recipient';

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

    DeliveryProblem.belongsTo(Recipient, {
      as: 'problems',
      foreignKey: 'delivery_id',
    });

    Recipient.hasMany(DeliveryProblem);

    return this;
  }
}
export default DeliveryProblem();
