import * as Yup from 'yup';
import Recipient from '../models/Recipient';

class RecipientController {
    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            street: Yup.string().required(),
            number: Yup.string().required(),
            state: Yup.string().required(),
            city: Yup.string().required(),
            zipcode: Yup.string().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res
                .status(401)
                .json({ error: 'Recipient validations fails' });
        }

        const recipientExists = await Recipient.findOne({
            where: {
                name: req.body.name,
                street: req.body.street,
                number: req.body.number,
            },
        });

        if (recipientExists) {
            return res.status(400).json({ error: 'Recipient already exists.' });
        }

        const {
            id,
            name,
            street,
            number,
            complement,
            state,
            city,
            zipcode,
        } = await Recipient.create(req.body);

        return res.json({
            id,
            name,
            street,
            number,
            complement,
            state,
            city,
            zipcode,
        });
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            street: Yup.string().required(),
            number: Yup.string().required(),
            state: Yup.string().required(),
            city: Yup.string().required(),
            zipcode: Yup.string().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res
                .status(401)
                .json({ error: 'Recipient validations fails' });
        }
        const { name } = req.body;

        const recipient = await Recipient.findByPk(req.body.user_id);

        const {
            id,
            street,
            complement,
            state,
            city,
            zipcode,
        } = await recipient.update(req.body);

        return res.json({
            id,
            name,
            street,
            complement,
            state,
            city,
            zipcode,
        });
    }
}
export default new RecipientController();
