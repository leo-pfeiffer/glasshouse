const cookie = require("cookie");
const querystring = require("querystring");
const generateRandomString = require('../../utils/generate-random-string')
const request = require("request");
const Cache = require("../../utils/cache");
const {API_URL} = require("../../utils/settings");

const CLIENT_ID = process.env.WHOOP_CLIENT_ID;
const CLIENT_SECRET = process.env.WHOOP_CLIENT_SECRET;

const REDIRECT_URI = API_URL + '/api/v1/whoop/callback';

const cache = new Cache();

const K_ACCESS_TOKEN = 'access-token'
const K_REFRESH_TOKEN = 'refresh-token'

cache.set(K_ACCESS_TOKEN, process.env.WHOOP_BASE_ACCESS_TOKEN)
cache.set(K_REFRESH_TOKEN, process.env.WHOOP_BASE_REFRESH_TOKEN)

const SCOPE = "offline read:recovery read:sleep read:workout read:cycles read:profile read:body_measurement"

const stateKey = 'whoop_auth_state';

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
            Location: 'https://api.prod.whoop.com/oauth/oauth2/auth?' + queryParams,
        }
    }
}

const callback = function (event) {
    const code = event.queryStringParameters.code || null;

    const authOptions = {
        url: 'https://api.prod.whoop.com/oauth/oauth2/token',
        form: {
            code: code,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            redirect_uri: REDIRECT_URI,
            grant_type: 'authorization_code',
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
                reject(error, body)

            }
        });
    })
}

const refresh = function () {

    const refresh_token = cache.get(K_REFRESH_TOKEN);

    if (refresh_token === undefined || refresh_token === null) {
        throw new Error("No token provided")
    }

    const authOptions = {
        url: 'https://api.prod.whoop.com/oauth/oauth2/token',
        form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token,
        },
        headers: {
            'Authorization': 'Basic ' + (Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
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
                reject(error, body)
            }
        });
    })
}

module.exports = {
    login, callback, refresh, cache
}