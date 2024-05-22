const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const collaboratorToken = require('../config/collaboratorToken');

module.exports = async (req, res, next) => {
    try {
        const autHeader = req.headers.authorization;
        if (!autHeader) {
            return res.status(401).json({ error: 'Token não encontrado' });
        }

        console.log('authHeader-Collaborator: ' + authHeader);
        console.log('collaboratorToken-Collaborator: ' + collaboratorToken.secret);

        const [, token] = autHeader.split(' ');

        await promisify(jwt.verify)(token, collaboratorToken.secret);

        console.log('token-Collaborator: ' + token);

        return next();
    } catch (error) {
        return res.status(401).json({ error: error.message });
    }
};