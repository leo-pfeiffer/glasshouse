const express = require('express')
const downloadRouter = express.Router()
const uploadRouter = express.Router()
const {read, write} = require("../services/fitness/main");

const uploadData = async function (req, res) {
    try {
        const rawWorkouts = req.body;
        await write(rawWorkouts)
    } catch (e) {
        console.error(e);
        return res.sendStatus(500);
    }
    return res.sendStatus(200);
}

const sendResponse = async function(req, res, next) {
    const data = await read();
    return res.status(200).json(data);
}

downloadRouter.get('/', sendResponse);
uploadRouter.post('/', uploadData);

module.exports = {downloadRouter, uploadRouter}