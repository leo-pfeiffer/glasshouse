const {read} = require("../services/fitness/main");
const {cors_headers} = require("../utils/cors");

module.exports.handler = async (event, context) => {

    const data = await read();

    return {
        statusCode: 200,
        body: JSON.stringify(data),
        headers: cors_headers
    }
}
