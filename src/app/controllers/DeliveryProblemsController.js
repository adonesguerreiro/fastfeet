import * as Yup from 'yup';
import DeliveryProblems from '../models/DeliveryProblems';

class DeliveryProblemsController {
  async allProblems(req, res) {
    const problems = await DeliveryProblems.findAll();
    return res.json(problems);
  }

  async problemsOrder(req, res) {
    const problemsOrderId = await DeliveryProblems.findByPk(req.params.id);

    if (!problemsOrderId) {
      return res.status(401).json({ error: 'The order not found' });
    }

    return res.json(problemsOrderId);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validations fails' });
    }
    if (!req.params || req.params.id === '') {
      return res.status(401).json({ error: 'Please, send a order' });
    }

    const problemsExists = await DeliveryProblems.findOne({
      where: {
        delivery_id: req.params.id,
      },
    });

    if (!problemsExists) {
      return res.status(401).json({ error: 'This problems id already exists' });
    }

    const { description } = await DeliveryProblems.create(req.body);

    return res.json({ description });
  }
}
export default new DeliveryProblemsController();
