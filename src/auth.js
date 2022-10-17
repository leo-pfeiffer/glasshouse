require('dotenv').config()

const user = process.env.APP_USER;
const password = process.env.APP_PW;
const auth = {}
auth[user] = password;

const authenticateString = function(authString) {
    const base64encoded = authString.split("Basic ")[1]
    const plain = Buffer.from(base64encoded, 'base64').toString();
    const arr = plain.split(":");
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
    authenticateString
};
