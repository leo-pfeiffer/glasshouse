const {read} = require("../services/fitness/main");

module.exports.handler = async (event, context) => {

    const data = await read();

    return {
        statusCode: 200,
        body: JSON.stringify(data)
    }
}
