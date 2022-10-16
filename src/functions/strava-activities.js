const mainService = require("../services/strava/main");
const {cors_headers} = require("../utils/cors");
const {setCache, withCache} = require("../utils/redis-cache");

const myFunc = async (event, context) => {

    const data = await mainService.getActivities();
    await setCache(event.rawUrl, JSON.stringify(data), 300)

    return {
        statusCode: 200,
        body: JSON.stringify(data),
        headers: cors_headers
    }
}

module.exports.handler = (event, context) => withCache(myFunc)(event, context);