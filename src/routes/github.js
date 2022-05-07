const express = require('express')
const router = express.Router()
const {read} = require('../services/github/main')

const sendResponse = async function(req, res, next) {
    const data = await read();
    return res.status(200).json(data);
}

router.get('/', sendResponse);

module.exports = router