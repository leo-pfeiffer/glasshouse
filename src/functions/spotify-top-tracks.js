const mainService = require("../services/spotify/main");
const {cors_headers} = require("../utils/cors");

module.exports.handler = async (event, context) => {

    const data = await mainService.getTopTracks();

    return {
        statusCode: 200,
        body: JSON.stringify(data),
        headers: cors_headers
    }
}
