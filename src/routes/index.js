const express = require('express')
const router = express.Router()

const sendResponse = async function(req, res) {
    return res.send('Hello World!');
}

router.get('/', sendResponse);

module.exports = router