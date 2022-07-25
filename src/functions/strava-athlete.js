const mainService = require("../services/strava/main");
const {cors_headers} = require("../utils/cors");

module.exports.handler = async (event, context) => {

    const data = await mainService.getAthlete();

    return {
        statusCode: 200,
        body: JSON.stringify(data),
        headers: cors_headers
    }
}
