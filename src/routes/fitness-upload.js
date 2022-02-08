const express = require('express')
const router = express.Router()
const {write} = require('../services/fitness/main')

const processRequest = async function (req, res) {
    console.log("Received data...")
    try {
        const rawWorkouts = req.body;
        await write(rawWorkouts)
    } catch (e) {
        console.error(e);
        return res.sendStatus(500);
    }
    return res.sendStatus(200);
}

router.post('/', processRequest)

module.exports = router