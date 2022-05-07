const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser');
const bodyParser = require("express");
const authenticate = require("./auth")

const indexRoute = require('./routes/index')
const fitnessRoute = require('./routes/fitness')
const wakaTimeRoute = require('./routes/wakatime')
const spotifyRoute = require('./routes/spotify')
const githubRoute = require('./routes/github')

const app = express()

// config
app.use(cors())
app.use(cookieParser());
app.use(express.urlencoded({extended: true}))
app.use(bodyParser.json({limit: '30mb'}));

// routes
app.use('/api/v1/index', indexRoute)
app.use('/api/v1/fitness-upload', authenticate, fitnessRoute.uploadRouter)
app.use('/api/v1/fitness', fitnessRoute.downloadRouter)
app.use('/api/v1/wakatime', wakaTimeRoute)
app.use('/api/v1/github', githubRoute)

app.use('/api/v1/spotify/top-tracks', spotifyRoute.topTracksRouter)
app.use('/api/v1/spotify/top-artists', spotifyRoute.topArtistsRouter)
app.use('/api/v1/spotify/currently-playing', spotifyRoute.currentlyPlayingRouter)
app.use('/api/v1/spotify/recently-played', spotifyRoute.recentlyPlayedRouter)
app.use('/api/v1/spotify/login', spotifyRoute.loginRouter)
app.use('/api/v1/spotify/callback', spotifyRoute.callbackRouter)

module.exports = app