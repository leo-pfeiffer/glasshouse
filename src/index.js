const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser');
const bodyParser = require("express");
const authenticate = require("./auth")

const fitnessUploadRoute = require('./routes/fitness-upload')
const fitnessRoute = require('./routes/fitness')
const wakaTimeRoute = require('./routes/wakatime')
const spotifyRoute = require('./routes/spotify')

const app = express()

// config
app.use(cors())
app.use(cookieParser());
app.use(express.urlencoded({extended: true}))
app.use(bodyParser.json({limit: '10mb'}));

// routes
app.use('/api/v1/fitness-upload', authenticate, fitnessUploadRoute)
app.use('/api/v1/fitness', fitnessRoute)
app.use('/api/v1/wakatime', wakaTimeRoute)

app.use('/api/v1/spotify', spotifyRoute.mainRouter)
app.use('/api/v1/spotify/login', spotifyRoute.loginRouter)
app.use('/api/v1/spotify/callback', spotifyRoute.callbackRouter)

module.exports = app