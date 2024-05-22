const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const collaboratorToken = require('../config/collaboratorToken');

module.exports = async (req, res, next) => {
    try {
        const autHeader = req.headers.authorization;
        if (!autHeader) {
            return res.status(401).json({ error: 'Token não encontrado' });
        }

        const [, token] = autHeader.split(' ');

        if (!token) {
            return res.status(401).json({ error: 'Token malformado' });
        }

        await promisify(jwt.verify)(token, collaboratorToken.secret);

        return next();
    } catch (error) {
        return res.status(401).json({ error: error.message });
    }
};