import * as Yup from 'yup';
import { format, parseISO, isWithinInterval } from 'date-fns';
import { Op } from 'sequelize';
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

  async show(req, res) {
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
      start_date: Yup.date(),
      end_date: Yup.date(),
      signature_id: Yup.number(),
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

    if (req.body.start_date) {
      const datefull = new Date();
      const date = format(datefull, 'yyyy-MM-dd');
      const startTime = parseISO(`${date}T08:00`);
      const finalTime = parseISO(`${date}T18:00`);

      const limitOrder = await Order.count({
        where: {
          start_date: {
            [Op.between]: [startTime, finalTime],
          },
        },
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

      if (
        !isWithinInterval(parseISO('2020-09-14T14:33:00-00:00'), {
          start: startTime,
          end: finalTime,
        })
      ) {
        return res.status(400).json({
          error: 'You cannot pick up your order before 8 am and after 6 pm',
        });
      }
      const initialDate = req.body.start_date.slice(0, 10);

      if (date !== initialDate) {
        return res.status(400).json({
          error:
            'You are informed of a withdrawal date different from the current date',
        });
      }
      if (limitOrder === 5) {
        return res.status(400).json({
          error: 'You already reached your daily order withdrawal limit',
        });
      }
    }

    if (req.body.end_date && req.body.signature_id) {
      const startDateExists = await Order.findByPk(req.body.order_id, {
        where: {
          start_date: {
            [Op.not]: null,
          },
        },
      });

      if (!startDateExists) {
        return res
          .status(401)
          .json({ error: 'The start date field is not informed.' });
      }
    }

    const {
      deliveryman_id,
      id,
      start_date,
      end_date,
      signature_id,
    } = await orderExists.update(req.body);

    return res.json({ deliveryman_id, id, start_date, end_date, signature_id });
  }
}

export default new OrderController();
