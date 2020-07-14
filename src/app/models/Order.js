import Sequelize, { Model } from 'sequelize';
import Deliveryman from './Deliveryman';

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
      },
      {
        sequelize,
      }
    );

    Order.belongsTo(Deliveryman);
    Deliveryman.hasMany(Order);

    return this;
  }

  static associations(models) {
    this.belongsTo(models.Deliveryman, {
      foreignKey: 'deliveryman_id',
      as: 'deliverymans',
    });
    this.belongsTo(models.Recipient, {
      foreignKey: 'recipient_id',
      as: 'recipients',
    });
    this.belongsTo(models.File, {
      foreignKey: 'signature_id',
      as: 'signature',
    });
  }
}
export default Order;
