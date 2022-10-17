const {cors_headers} = require("../utils/cors");
module.exports.handler = async (event, context) => {
    return {
        statusCode: 200,
        body: "Hello world!",
        headers: cors_headers
    }
}
