import DeliveryProblem from '../models/DeliveryProblem';

class DeliveryProblemController {
  async allProblems(req, res) {
    const problems = await DeliveryProblem.findAll();
    return res.json(problems);
  }

  async problemsOrder(req, res) {
    const problemsOrderId = await DeliveryProblem.findByPk(req.params.id);

    if (!problemsOrderId) {
      return res.status(401).json({ error: 'The order not found' });
    }

    return res.json(problemsOrderId);
  }

  async store(req, res) {
    const delivery_id = req.params.id;
    const { description } = req.body;

    const problems = await DeliveryProblem.findByPk(delivery_id);

    if (problems) {
      return res.json({ error: 'This delivery problems of order does exists' });
    }

    const result = await DeliveryProblem.create({
      delivery_id,
      description,
    });

    return res.json(result);
  }

  async update(req, res) {
    const delivery_id = req.params.id;
    const { description } = req.body;

    const problemsUpdate = await DeliveryProblem.findByPk(delivery_id);

    if (!problemsUpdate) {
      return res.json({ error: 'The order not found' });
    }

    const result = await DeliveryProblem.update({
      delivery_id,
      description,
    });

    return res.json(result);
  }
}
export default new DeliveryProblemController();
