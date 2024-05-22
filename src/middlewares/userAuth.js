const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const userToken = require('../config/userToken');

module.exports = async (req, res, next) => {
    try {
        const autHeader = req.headers.authorization;
        if (!autHeader) {
            return res.status(401).json({ error: 'Token não encontrado' });
        }

        console.log('authHeader-User: ' + authHeader);
        console.log('userToken-User: ' + userToken.secret);

        const [, token] = autHeader.split(' ');

        await promisify(jwt.verify)(token, userToken.secret);

        console.log('token-User: ' + token);

        return next();
    } catch (error) {
        return res.status(401).json({ error: error.message });
    }
};