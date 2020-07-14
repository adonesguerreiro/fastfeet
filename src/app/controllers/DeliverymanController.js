import * as Yup from 'yup';
import Deliveryman from '../models/Deliveryman';

class DeliverymanController {
    async index(req, res) {
        const deliverymans = await Deliveryman.findAll({
            attributes: ['id', 'name', 'email', 'avatar_id'],
        });

        return res.json(deliverymans);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(401).json({ error: 'Validations fails' });
        }

        const deliverymanExists = await Deliveryman.findOne({
            where: { email: req.body.email },
        });

        if (deliverymanExists) {
            return res.status(401).json({ error: 'Deliveryman exists' });
        }

        const deliveryman = await Deliveryman.create(req.body);

        return res.json(deliveryman);
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(401).json({ error: 'Validations fails' });
        }

        const deliverymanExists = await Deliveryman.findByPk(req.body.id);

        if (!deliverymanExists) {
            return res
                .status(400)
                .json({ error: 'Deliveryman does not exists' });
        }

        const deliveryman = await deliverymanExists.update(req.body);

        return res.json(deliveryman);
    }

    async delete(req, res) {
        const deliverymanDelete = await Deliveryman.findByPk(req.params.id);

        if (!deliverymanDelete) {
            return res
                .status(400)
                .json({ error: 'Deliveryman does not exists' });
        }

        if (await deliverymanDelete.destroy()) {
            return res.status(200).json({ error: 'Deliveryman deleted' });
        }

        return res.json(deliverymanDelete);
    }
}
export default new DeliverymanController();
