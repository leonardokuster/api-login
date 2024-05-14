const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const userToken = require('../config/userToken');

module.exports = async (req, res, next) => {
    try {
        const autHeader = req.headers.authorization;
        if (!autHeader) {
            return res.status(401).json({ error: 'Token não encontrado' });
        }

        const [, token] = autHeader.split(' ');

        await promisify(jwt.verify)(token, userToken.secret);

        return next();
    } catch (error) {
        return res.status(401).json({ error: error.message });
    }
};