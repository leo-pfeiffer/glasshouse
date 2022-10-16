const {read} = require("../services/wakatime/main");
const {cors_headers} = require("../utils/cors");
const {withCache, setCache} = require("../utils/redis-cache");

const wakatime = async (event, context) => {

    const data = await read();
    await setCache(event.rawUrl, JSON.stringify(data), 7200)

    return {
        statusCode: 200,
        body: JSON.stringify(data),
        headers: cors_headers
    }
}

module.exports.handler = (event, context) => withCache(wakatime)(event, context);