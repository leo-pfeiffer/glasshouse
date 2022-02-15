require('dotenv').config();
const request = require('request');
const {cache, refresh} = require("./auth");


const getData = async function(req, res) {

    const url = 'https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=5'

    const options = () => {
        return {
            url: url,
            headers: {'Authorization': 'Bearer ' + cache.accessToken},
            json: true
        }
    };

    // make the actual request
    return new Promise((resolve, reject) => {
        request.get(options(), async function (error, response, body) {
            if (body.hasOwnProperty('error') && body.error.status === 401) {

                // refresh token
                await refresh(req, res);

                await request.get(options(), function (error, response, body) {
                    resolve(body)
                })
            } else {
                resolve(body)
            }
            return body
        })
    })
}

const read = async function(req, res) {
    return getData(req, res)
}


module.exports = {
    read
}
