require('dotenv').config();

module.exports = {
    "secret": process.env.ADMIN_SECRET,
    "expiresIn": process.env.ADMIN_EXPIRES,
};