require('dotenv').config()
const basicAuth = require('express-basic-auth')

const user = process.env.APP_USER;
const password = process.env.APP_PW;
const auth = {}
auth[user] = password;

const authenticate = async function(req, res, next) {
    basicAuth({users: auth})(req, res, next);
}

module.exports = authenticate;
