const {login} = require("../services/spotify/auth");

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
