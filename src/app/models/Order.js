import Sequelize, { Model } from 'sequelize';
import Deliveryman from './Deliveryman';
import Recipient from './Recipient';

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
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `http://localhost:2000/order/${this.path}`;
          },
        },
      },
      {
        sequelize,
      }
    );

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

  static associations(models) {
    this.belongsTo(models.File, {
      as: 'signature',
    });
  }
}
export default Order;
