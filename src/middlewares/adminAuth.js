const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const adminToken = require('../config/adminToken');

module.exports = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'Token não encontrado' });
        }

        console.log('authHeader-Admin: ' + authHeader);
        console.log('adminToken-Admin: ' + adminToken.secret);

        const [, token] = authHeader.split(' ');

        await promisify(jwt.verify)(token, adminToken.secret);

        console.log('token-Admin: ' + token);

        return next();
    } catch (error) {
        return res.status(401).json({ error: error.message });
    }
};