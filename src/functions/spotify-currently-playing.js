const mainService = require("../api_services/spotify/main");
const {cors_headers} = require("../utils/cors");
const {setCache, withCache} = require("../utils/redis-cache");

const spotifyCurrentlyPlaying = async (event, context) => {

    const data = await mainService.getCurrentlyPlaying();
    await setCache(event.rawUrl, JSON.stringify(data), 60)

    return {
        statusCode: 200,
        body: JSON.stringify(data),
        headers: cors_headers
    }
}

module.exports.handler = (event, context) => withCache(spotifyCurrentlyPlaying)(event, context);