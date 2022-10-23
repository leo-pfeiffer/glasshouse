const {login} = require("../api_services/whoop/auth");

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
