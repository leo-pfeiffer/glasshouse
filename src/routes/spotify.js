const express = require('express')
const dataRouter = express.Router()
const loginRouter = express.Router()
const callbackRouter = express.Router()
const currentlyPlayingRouter = express.Router()

const authService = require('../services/spotify/auth')
const mainService = require('../services/spotify/main')

const sendData = async function(req, res) {
    const data = await mainService.getData(req, res);
    return res.status(200).json(data);
}

const sendCurrentlyPlaying = async function(req, res) {
    const data = await mainService.getCurrentlyPlaying(req, res);
    return res.status(200).json(data);
}

dataRouter.get('/', sendData);
currentlyPlayingRouter.get('/', sendCurrentlyPlaying);
loginRouter.get('/', authService.login);
callbackRouter.get('/', authService.callback);


module.exports = {
    dataRouter,
    loginRouter,
    callbackRouter,
    currentlyPlayingRouter
}