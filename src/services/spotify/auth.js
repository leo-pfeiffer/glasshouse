require('dotenv').config();
const request = require('request'); // "Request" library
const querystring = require('querystring');
const Cache = require('../../utils/cache')
const generateRandomString = require('../../utils/generate-random-string')
const cookie = require("cookie");
const {API_URL} = require("../../utils/settings");

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;                      // Your client id
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;              // Your secret

const REDIRECT_URI = API_URL + '/api/v1/spotify/callback'; // Your redirect uri

const cache = new Cache();

const K_ACCESS_TOKEN = 'access-token'
const K_REFRESH_TOKEN = 'refresh-token'

cache.set(K_ACCESS_TOKEN, process.env.SPOTIFY_BASE_ACCESS_TOKEN)
cache.set(K_REFRESH_TOKEN, process.env.SPOTIFY_BASE_REFRESH_TOKEN)

const SCOPE = 'user-top-read user-read-currently-playing user-read-recently-played';

const stateKey = 'spotify_auth_state';

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
            Location: 'https://accounts.spotify.com/authorize?' + queryParams
        }
    }
}

const callback = function (event) {
    const code = event.queryStringParameters.code || null;

    const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code: code,
            redirect_uri: REDIRECT_URI,
            grant_type: 'authorization_code'
        },
        headers: {
            'Authorization': 'Basic ' + (Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
        },
        json: true
    };

    return new Promise(function(resolve, reject) {

        request.post(authOptions, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                const accessToken = body.access_token;
                const refreshToken = body.refresh_token;
                cache.set(K_ACCESS_TOKEN, accessToken)
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

    console.log("Refreshing spotify token")

    const refresh_token = cache.get(K_REFRESH_TOKEN);

    if (refresh_token === undefined || refresh_token === null) {
        throw new Error("No token provided")
    }

    const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {'Authorization': 'Basic ' + (Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))},
        form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token
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