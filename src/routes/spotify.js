const express = require('express')
const topArtistsRouter = express.Router()
const topTracksRouter = express.Router()
const loginRouter = express.Router()
const callbackRouter = express.Router()
const currentlyPlayingRouter = express.Router()

const authService = require('../services/spotify/auth')
const mainService = require('../services/spotify/main')

const sendTopTracks = async function(req, res) {
    const data = await mainService.getTopTracks(req, res);
    return res.status(200).json(data);
}

const sendTopArtists = async function(req, res) {
    const data = await mainService.getTopArtists(req, res);
    return res.status(200).json(data);
}

const sendCurrentlyPlaying = async function(req, res) {
    const data = await mainService.getCurrentlyPlaying(req, res);
    return res.status(200).json(data);
}

topArtistsRouter.get('/', sendTopArtists);
topTracksRouter.get('/', sendTopTracks);
currentlyPlayingRouter.get('/', sendCurrentlyPlaying);
loginRouter.get('/', authService.login);
callbackRouter.get('/', authService.callback);


module.exports = {
    topTracksRouter,
    topArtistsRouter,
    loginRouter,
    callbackRouter,
    currentlyPlayingRouter
}