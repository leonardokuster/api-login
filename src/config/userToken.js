require('dotenv').config();

module.exports = {
    "secret": process.env.USER_SECRET,
    "expiresIn": process.env.USER_EXPIRES,
};