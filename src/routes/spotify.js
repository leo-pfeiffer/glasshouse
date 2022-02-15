const express = require('express')
const mainRouter = express.Router()
const loginRouter = express.Router()
const callbackRouter = express.Router()

const authService = require('../services/spotify/auth')
const mainService = require('../services/spotify/main')

const sendResponse = async function(req, res, next) {
    const data = await mainService.read(req, res);
    return res.status(200).json(data);
}

mainRouter.get('/', sendResponse);
loginRouter.get('/', authService.login);
callbackRouter.get('/', authService.callback);


module.exports = {
    mainRouter,
    loginRouter,
    callbackRouter
}