require('dotenv').config();

const userToken = process.env.USER_TOKEN;

if (!userToken) {
    throw new Error('USER_TOKEN não está definido no arquivo .env');
}

module.exports = {
    secret: userToken,
    expiresIn: '5d',
};