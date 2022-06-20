require('dotenv').config()
const basicAuth = require('express-basic-auth')

const user = process.env.APP_USER;
const password = process.env.APP_PW;
const auth = {}
auth[user] = password;

const authenticate = async function(req, res, next) {
    basicAuth({users: auth})(req, res, next);
}

const authenticateString = function(authString) {
    const plain = atob(authString.split("Basic ")[1]);
    const arr = plain.split(":");
    console.log(arr)
    if (arr.length !== 2) {
        return false
    }
    else if (!(arr[0] in auth)) {
        return false
    }
    else {
        return auth[arr[0]] === arr[1]
    }
}

module.exports = {
    authenticate, authenticateString
};
