import DeliveryProblem from '../models/DeliveryProblem';
import Recipient from '../models/Recipient';

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
}
export default ProblemsController();
