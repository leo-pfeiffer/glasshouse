const mainService = require("../services/spotify/main");
const {cors_headers} = require("../utils/cors");
const {withCache, setCache} = require("../utils/redis-cache");

const spotifyRecentlyPlayed = async (event, context) => {

    const data = await mainService.getRecentlyPlayed();
    await setCache(event.rawUrl, JSON.stringify(data), 60)

    return {
        statusCode: 200,
        body: JSON.stringify(data),
        headers: cors_headers
    }
}

module.exports.handler = (event, context) => withCache(spotifyRecentlyPlayed)(event, context);