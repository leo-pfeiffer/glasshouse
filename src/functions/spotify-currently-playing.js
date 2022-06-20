const mainService = require("../services/spotify/main");

module.exports.handler = async (event, context) => {

    const data = await mainService.getCurrentlyPlaying();

    return {
        statusCode: 200,
        body: JSON.stringify(data)
    }
}
