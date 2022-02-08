const express = require('express')
const cors = require('cors')
const bodyParser = require("express");
const authenticate = require("./auth")

const fitnessUploadRoute = require('./routes/fitness-upload')
const fitnessRoute = require('./routes/fitness')
const wakaTimeRoute = require('./routes/wakatime')

const app = express()

// config
app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(bodyParser.json({limit: '10mb'}));

// routes
app.use('/api/v1/fitness-upload', authenticate, fitnessUploadRoute)
app.use('/api/v1/fitness', fitnessRoute)
app.use('/api/v1/wakatime', wakaTimeRoute)

module.exports = app