require('dotenv').config();

module.exports = {
    "secret": process.env.COLLABORATOR_SECRET,
    "expiresIn": process.env.COLLABORATOR_EXPIRES,
};