const {callback} = require("../services/spotify/auth");

module.exports.handler = async (event, context) => {

    try {
        const tokens = await callback(event)
        return {
            statusCode: 200,
            body: JSON.stringify({'Access Token': tokens.access_token, 'Refresh Token': tokens.refresh_token})
        }
    } catch (e) {
        console.error(e)
        return {
            statusCode: 401,
            body: "Invalid token"
        }
    }
}
