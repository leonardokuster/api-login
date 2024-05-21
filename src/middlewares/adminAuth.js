require('dotenv').config();
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const adminToken = require('../config/adminToken');

module.exports = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        console.log('adminToken: ' + adminToken.secret);
        console.log('authHeader: ' + authHeader);

        if (!authHeader) {
            return res.status(401).json({ error: 'Token não encontrado' });
        }

        const [, token] = authHeader.split(' ');

        if (!token) {
            return res.status(401).json({ error: 'Token malformado' });
        }

        await promisify(jwt.verify)(token, adminToken.secret);

        console.log('Token verificado com sucesso');

        return next();
    } catch (error) {
        console.error('Erro ao verificar o token:', error);
        return res.status(401).json({ error: 'Token inválido' });
    }
};
