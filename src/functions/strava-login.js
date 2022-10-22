const {login} = require("../api_services/strava/auth");

module.exports.handler = async (event, context) => {

    try {
        return login()
    } catch (e) {
        return {
            statusCode: 500,
            body: "Internal Server Error"
        }
    }
}
