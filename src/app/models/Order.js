import Sequelize, { Model } from 'sequelize';
import Deliveryman from './Deliveryman';
import Recipient from './Recipient';
import File from './File';

class Order extends Model {
  static init(sequelize) {
    super.init(
      {
        recipient_id: Sequelize.INTEGER,
        deliveryman_id: Sequelize.INTEGER,
        product: Sequelize.STRING,
        canceled_at: Sequelize.DATE,
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        signature_id: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );

    Order.belongsTo(File, {
      as: 'signatures',
      foreignKey: 'signature_id',
    });
    Order.belongsTo(Deliveryman, {
      as: 'deliverymans',
      foreignKey: 'deliveryman_id',
    });
    Deliveryman.hasMany(Order);

    Order.belongsTo(Recipient, {
      as: 'recipients',
      foreignKey: 'recipient_id',
    });

    Recipient.hasMany(Order);

    return this;
  }
}
export default Order;
