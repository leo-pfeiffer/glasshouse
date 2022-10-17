const {read} = require("../services/github/main");
const {cors_headers} = require("../utils/cors");
const {withCache, setCache} = require("../utils/redis-cache");

const github = async (event, context) => {

    const data = await read();
    await setCache(event.rawUrl, JSON.stringify(data), 7200)

    return {
        statusCode: 200,
        body: JSON.stringify(data),
        headers: cors_headers
    }
}

module.exports.handler = (event, context) => withCache(github)(event, context);