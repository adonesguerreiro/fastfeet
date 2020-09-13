import DeliveryProblems from '../models/DeliveryProblems';

class DeliveryProblemsController {
  async allProblems(req, res) {
    const problems = await DeliveryProblems.findAll();
    return res.json(problems);
  }

  async problemsOrder(req, res) {
    const problemsOrderId = await DeliveryProblems.findByPk(
      req.params.delivery_id
    );

    if (!problemsOrderId) {
      return res.status(401).json({ error: 'The order not found' });
    }

    return res.json(problemsOrderId);
  }
}
export default new DeliveryProblemsController();
