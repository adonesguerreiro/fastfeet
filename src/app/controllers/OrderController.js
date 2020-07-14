import * as Yup from 'yup';
import Order from '../models/Order';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';
import Mail from '../../lib/Mail';

class OrderController {
  async index(req, res) {
    const orders = await Order.findAll({
      attributes: [
        'id',
        'recipient_id',
        'deliveryman_id',
        'product',
        'canceled_at',
        'start_date',
        'end_date',
      ],
    });

    return res.json(orders);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validations fails' });
    }

    const recipientExists = await Recipient.findByPk(req.body.recipient_id, {
      attributes: ['name', 'street', 'number', 'state', 'city', 'zipcode'],
      where: {
        id: req.body.recipient_id,
      },
    });

    if (!recipientExists) {
      return res.status(400).json({ error: 'Recipient does not exists' });
    }

    const deliverymanExists = await Deliveryman.findByPk(
      req.body.deliveryman_id,
      {
        attributes: ['name', 'email'],
        where: {
          id: req.body.deliveryman_id,
        },
      }
    );

    if (!deliverymanExists) {
      return res.status(400).json({ error: 'Delivery does not exists' });
    }

    const order = await Order.create(req.body);

    await Mail.sendMail({
      to: `${deliverymanExists.name} <${deliverymanExists.email}>`,
      subject: 'Nova entrega',
      html: 'Olá, você possui uma nova encomenda a ser entregue',
    });

    return res.json(order);
  }
}

export default new OrderController();
