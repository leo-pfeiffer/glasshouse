require('dotenv').config();
const request = require('request'); // "Request" library
const querystring = require('querystring');
const TokenCache = require("./tokenCache");

const client_id = process.env.SPOTIFY_CLIENT_ID;                      // Your client id
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;              // Your secret
const redirect_uri = 'http://localhost:5720/api/v1/spotify/callback'; // Your redirect uri

// const cache = new Map();
const cache = new TokenCache();

cache.accessToken = process.env.SPOTIFY_BASE_ACCESS_TOKEN
cache.refreshToken = process.env.SPOTIFY_BASE_REFRESH_TOKEN


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
    const scope = 'user-read-private user-read-email user-top-read';

    const queryParams = querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
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
            redirect_uri: redirect_uri,
            grant_type: 'authorization_code'
        },
        headers: {
            'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))
        },
        json: true
    };

    request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            const access_token = body.access_token;
            const refresh_token = body.refresh_token;
            cache.accessToken = access_token
            res.send({'Access Token': access_token, 'Refresh Token': refresh_token})
        }
        // Invalid token
        else {
            res.redirect('/#' + querystring.stringify({error: 'invalid_token'}));
        }
    });
}

const refresh = function (req, res) {

    console.log("Refreshing token")

    const refresh_token = req.query.refresh_token || cache.refreshToken;

    if (refresh_token === undefined || refresh_token === null) {
        throw new Error("No token provided")
    }

    const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))},
        form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        },
        json: true
    };

    return new Promise(function(resolve, reject) {
        request.post(authOptions, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                cache.accessToken = body.access_token
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