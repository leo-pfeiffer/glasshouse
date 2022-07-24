const request = require("request");
module.exports = function(options) {
    return new Promise(function(resolve, reject) {
        return request.get(options, function (error, response, body) {
            if (error) return reject(error)
            if (response.statusCode === 204) return resolve({})
            return resolve(body)
        })
    })
}