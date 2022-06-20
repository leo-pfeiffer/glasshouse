const {loginServerless} = require("../services/spotify/auth");

module.exports.handler = async (event, context) => {

    try {
        return loginServerless()
    } catch (e) {
        return {
            statusCode: 500,
            body: "Internal Server Error"
        }
    }
}
