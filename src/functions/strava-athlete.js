const mainService = require("../api_services/strava/main");
const {cors_headers} = require("../utils/cors");
const {setCache, withCache} = require("../utils/redis-cache");

const stravaAthlete = async (event, context) => {

    const data = await mainService.getAthlete();
    await setCache(event.rawUrl, JSON.stringify(data), 3600)

    return {
        statusCode: 200,
        body: JSON.stringify(data),
        headers: cors_headers
    }
}

module.exports.handler = (event, context) => withCache(stravaAthlete)(event, context);