import * as Yup from 'yup';
import Order from '../models/Order';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';
import Queue from '../../lib/Queue';
import PackageDelivery from '../jobs/PackageDelivery';

class OrderController {
  async index(req, res) {
    const orders = await Order.findAll({
      attributes: ['id', 'recipient_id', 'deliveryman_id', 'product'],
    });

    return res.json(orders);
  }

  async indexdeliveryman(req, res) {
    const orderDeliveryman = await Order.findAll({
      attributes: ['id', 'product'],
      where: {
        end_date: null,
        canceled_at: null,
      },
      include: [
        {
          model: Deliveryman,
          as: 'deliverymans',
          attributes: ['id', 'name'],
          where: {
            id: req.params.id,
          },
        },
      ],
    });
    return res.json(orderDeliveryman);
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

    const recipientExists = await Recipient.findByPk(req.body.recipient_id);

    if (!recipientExists) {
      return res.status(400).json({ error: 'Recipient does not exists' });
    }

    const deliverymanExists = await Deliveryman.findByPk(
      req.body.deliveryman_id
    );

    if (!deliverymanExists) {
      return res.status(400).json({ error: 'Delivery does not exists' });
    }

    const { id, product, deliveryman_id } = await Order.create(req.body);

    const dataOrder = await Order.findByPk(id, {
      include: [
        {
          model: Deliveryman,
          as: 'deliverymans',
          attributes: ['name', 'email'],
          where: {
            id: req.body.deliveryman_id,
          },
        },

        {
          model: Recipient,
          as: 'recipients',
          attributes: ['name', 'street', 'number', 'state', 'city', 'zipcode'],
          where: {
            id: req.body.recipient_id,
          },
        },
      ],
    });

    await Queue.add(PackageDelivery.key, {
      dataOrder,
    });

    return res.json({ id, product, deliveryman_id });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      deliveryman_id: Yup.number().required(),
      id: Yup.number().required(),
      start_date: Yup.date().required(),
      end_date: Yup.date(),
    });

    if (await schema.isValid(req.body)) {
      return res.status(401).json({ error: 'Validations fails' });
    }

    const orderExists = await Order.findByPk(req.body.order_id, {
      include: [
        {
          model: Deliveryman,
          as: 'deliverymans',
          where: {
            id: req.body.deliveryman_id,
          },
        },
      ],
    });

    if (!orderExists) {
      return res
        .status(400)
        .json({ error: 'This order or deliveryman does not exists' });
    }

    const {
      deliveryman_id,
      id,
      start_date,
      end_date,
    } = await orderExists.update(req.body);

    return res.json({ deliveryman_id, id, start_date, end_date });
  }
}

export default new OrderController();
