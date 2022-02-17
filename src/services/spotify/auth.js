require('dotenv').config();
const request = require('request'); // "Request" library
const querystring = require('querystring');
const Cache = require('../../utils/cache')

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;                      // Your client id
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;              // Your secret
const REDIRECT_URI = 'http://localhost:5720/api/v1/spotify/callback'; // Your redirect uri

const cache = new Cache();

const K_ACCESS_TOKEN = 'access-token'
const K_REFRESH_TOKEN = 'refresh-token'

cache.set(K_ACCESS_TOKEN, process.env.SPOTIFY_BASE_ACCESS_TOKEN)
cache.set(K_REFRESH_TOKEN, process.env.SPOTIFY_BASE_REFRESH_TOKEN)

const SCOPE = 'user-top-read user-read-currently-playing user-read-recently-played';

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = function (length) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuavwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

const stateKey = 'spotify_auth_state';

const login = function (req, res) {
    const state = generateRandomString(16);
    res.cookie(stateKey, state);

    const queryParams = querystring.stringify({
        response_type: 'code',
        client_id: CLIENT_ID,
        scope: SCOPE,
        redirect_uri: REDIRECT_URI,
        state: state
    })

    res.redirect('https://accounts.spotify.com/authorize?' + queryParams);
}

const callback = function (req, res) {
    const code = req.query.code || null;

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

    request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            const accessToken = body.access_token;
            const refreshToken = body.refresh_token;

            cache.set(K_ACCESS_TOKEN, accessToken)

            res.send({'Access Token': accessToken, 'Refresh Token': refreshToken})
        }
        // Invalid token
        else {
            res.redirect('/#' + querystring.stringify({error: 'invalid_token'}));
        }
    });
}

const refresh = function (req, res) {

    console.log("Refreshing token")

    const refresh_token = req.query.refresh_token || cache.get(K_REFRESH_TOKEN);

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