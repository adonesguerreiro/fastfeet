import * as Yup from 'yup';
import DeliveryProblem from '../models/DeliveryProblem';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';

class ProblemsController {
  async index(req, res) {
    const problems = await DeliveryProblem.findAll();

    return res.json(problems);
  }

  async show(req, res) {
    const deliveryProblem = DeliveryProblem.findAll({
      attributes: ['id', 'description'],
      include: [
        {
          model: Recipient,
          as: 'problems',
          attributes: ['id', 'name'],
          where: {
            id: req.params.id,
          },
        },
      ],
    });

    return res.json(deliveryProblem);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      deliveryman_id: Yup.number().required(),
      description: Yup.string.required(),
    });

    if (
      !((await schema.isValid(req.body)) || !(await schema.isValid(req.params)))
    ) {
      return res.status(401).json({ error: 'Validations fails' });
    }

    const deliverymanIdExists = await Deliveryman.findByPk(
      req.params.deliveryman_id
    );

    if (!deliverymanIdExists) {
      return res
        .status(401)
        .json({ error: 'This deliveryman does not exists' });
    }

    const { deliveryman_id, description } = await DeliveryProblem.create(
      req.body
    );

    return res.json({ deliveryman_id, description });
  }
}
export default new ProblemsController();
