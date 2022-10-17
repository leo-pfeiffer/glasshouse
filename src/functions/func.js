module.exports.handler = async (event, context) => {
    return {
        statusCode: 200,
        body: "Hello world!",
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Credentials': 'true',
        }
    }
}