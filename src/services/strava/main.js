require('dotenv').config();
const request = require('request');
const {cache, refresh} = require("./auth");
const hashString = require("../../utils/hashing");
const retry = require("../../utils/retry");
const {getToday, secondsUntilEndOfDay} = require("../../utils/datetime");


const K_ACCESS_TOKEN = 'access-token'


const stravaClient = async function(url) {

    const options = () => {
        return {
            url: url,
            headers: {'Authorization': 'Bearer ' + cache.get(K_ACCESS_TOKEN)},
            json: true
        }
    };

    // make the actual request
    return new Promise((resolve, reject) => {
        request.get(options(), async function (error, response, body) {
            if (error) return reject(error)
            if (response.statusCode === 204) return resolve({})

            let returnVal = body
            if (body.hasOwnProperty('error') && body.error.status === 401) {

                // refresh token
                await refresh();
                returnVal = await retry(options())
                resolve(returnVal)

            } else {
                resolve(returnVal)
            }
        })
    })
}

const getData = async function (url, ttl) {

    const key = hashString(getToday().toString() + url)

    if (cache.has(key)) return cache.get(key)

    const entry = await stravaClient(url)
    cache.set(key, entry, ttl)
    return entry
}

const getAthlete = function() {
    const url = 'https://www.strava.com/api/v3/athlete'
    const ttl = secondsUntilEndOfDay()
    return getData(url, ttl)
}


module.exports = {
    getAthlete
}
