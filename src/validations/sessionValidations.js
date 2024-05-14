const yup = require('yup');

class SessionValidations {
    async index(req, res, next) {
        const schema = yup.object().shape({
            tipo: yup.string().required(),
        });

        try {
            await schema.validate(req.body, { abortEarly: false });
            return next();
        } catch (error) {
            return res.status(401).json({ error: 'Tipo não encontrado.', details: error.errors });
        }
    }
}

module.exports = SessionValidations