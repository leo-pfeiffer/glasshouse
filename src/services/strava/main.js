require('dotenv').config();
const request = require('request');
const {cache, refresh} = require("./auth");
const hashString = require("../../utils/hashing");
const retry = require("../../utils/retry");
const {getToday, secondsUntilEndOfDay, minusOneMonth} = require("../../utils/datetime");


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

    if (cache.has(key)) {
        console.log("Yay")
        return cache.get(key)
    }

    console.log("Booh")

    const entry = await stravaClient(url)
    cache.set(key, entry, ttl)
    return entry
}

const getAthlete = function() {
    const url = 'https://www.strava.com/api/v3/athlete'
    const ttl = secondsUntilEndOfDay()
    return getData(url, ttl)
}

const getActivities = async function() {
    const date = minusOneMonth(new Date())

    const epochTimestamp = Math.floor(date / 1000)

    const url = `https://www.strava.com/api/v3/athlete/activities?after=${epochTimestamp}&per_page=100`
    const ttl = secondsUntilEndOfDay()
    const activities = await getData(url, ttl)

    console.log(activities)

    return activities.map(activityTransform).filter(e => e !== null);

}

const activityTransform = function (activity) {
    try {
        const transformed = {}
        transformed['name'] = activity['name']
        transformed['duration'] = activity['moving_time'] / 60  // duration in minutes
        transformed['type'] = activity['type']
        transformed['max_hr'] = activity['max_heartrate']
        transformed['avg_hr'] = activity['average_heartrate']
        transformed['distance'] = activity['distance']
        transformed['start_date'] = activity['start_date']
        return transformed
    } catch (e) {
        return null;
    }

}


module.exports = {
    getAthlete, getActivities
}
