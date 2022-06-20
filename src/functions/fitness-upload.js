const {write} = require("../services/fitness/main");
const {authenticateString} = require("../auth");

module.exports.handler = async (event, context) => {

    // Check for POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: "Method not allowed"
        }
    }

    // Authenticate
    try {
        if (!authenticateString(event.headers.authorization)) {
            return {
                statusCode: 401,
                body: "Unauthorized."
            }
        }
    } catch (e) {
        console.error(e)
        return {
            statusCode: 401,
            body: "Unauthorized. " + e.message
        }
    }

    try {
        await write(JSON.parse(event.body))
        return {
            statusCode: 200,
            body: "Success"
        }
    } catch (e) {
        console.error(e);
        return {
            statusCode: 500,
            body: "Internal Server Error"
        }
    }
}
