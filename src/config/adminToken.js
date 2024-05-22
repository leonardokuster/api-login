require('dotenv').config();

const adminToken = process.env.ADMIN_TOKEN;

if (!adminToken) {
    throw new Error('ADMIN_TOKEN não está definido no arquivo .env');
}

module.exports = {
    secret: adminToken,
    expiresIn: '5d'
}; 