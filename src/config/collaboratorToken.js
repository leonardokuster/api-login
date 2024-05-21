require('dotenv').config();

const collaboratorToken = process.env.COLLABORATOR_TOKEN;

if (!collaboratorToken) {
    throw new Error('COLLABORATOR_TOKEN não está definido no arquivo .env');
}

module.exports = {
    secret: collaboratorToken,
    expiresIn: '5d',
};