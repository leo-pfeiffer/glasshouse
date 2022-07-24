const cookie = require("cookie");
const querystring = require("querystring");
const generateRandomString = require('../../utils/generate-random-string')
const request = require("request");
const Cache = require("../../utils/cache");

const CLIENT_ID = process.env.STRAVA_CLIENT_ID;
const CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;

const BASE_URL = process.env.BASE_URL || 'http://localhost:' + (process.env.PORT || 8080)
const REDIRECT_URI = BASE_URL + '/api/v1/strava/callback';

const cache = new Cache();

const K_ACCESS_TOKEN = 'access-token'
const K_REFRESH_TOKEN = 'refresh-token'

cache.set(K_ACCESS_TOKEN, process.env.STRAVA_BASE_ACCESS_TOKEN)
cache.set(K_REFRESH_TOKEN, process.env.STRAVA_BASE_REFRESH_TOKEN)

const SCOPE = 'read_all,activity:read_all,profile:read_all'

const stateKey = 'strava_auth_state';

const login = function () {

    const state = generateRandomString(16);

    const myCookie = cookie.serialize(stateKey, state, {
        secure: true,
        httpOnly: true,
        path: '/',
    })

    const queryParams = querystring.stringify({
        response_type: 'code',
        client_id: CLIENT_ID,
        scope: SCOPE,
        redirect_uri: REDIRECT_URI,
        state: state
    })

    return {
        statusCode: 302,
        headers: {
            'Set-Cookie': myCookie,
            Location: 'https://www.strava.com/oauth/authorize?' + queryParams
        }
    }
}


const callback = function (event) {
    const code = event.queryStringParameters.code || null;

    const authOptions = {
        url: 'https://www.strava.com/api/v3/oauth/token',
        form: {
            code: code,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: 'authorization_code'
        },
        json: true
    };

    return new Promise(function(resolve, reject) {

        request.post(authOptions, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                const accessToken = body.access_token;
                const refreshToken = body.refresh_token;
                resolve(body)
            }
            // Invalid token
            else {
                reject(error)

            }
        });
    })
}

const refresh = function () {

    console.log("Refreshing strava token")

    const refresh_token = cache.get(K_REFRESH_TOKEN);

    if (refresh_token === undefined || refresh_token === null) {
        throw new Error("No token provided")
    }

    const authOptions = {
        url: 'https://www.strava.com/api/v3/oauth/token',
        form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
        },
        json: true
    };

    return new Promise(function(resolve, reject) {
        request.post(authOptions, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                cache.set(K_ACCESS_TOKEN, body.access_token)
                resolve(body)
            }
            else {
                reject(error)
            }
        });
    })
}

module.exports = {
    login, callback, refresh, cache
}