require('dotenv').config();
const generateRandomString = require("@/utils/generate-random-string");
const cookie = require("cookie");
const querystring = require("querystring");
const request = require("request");
const Cache = require("cache");

const K_ACCESS_TOKEN = 'access-token'
const K_REFRESH_TOKEN = 'refresh-token'

module.exports = class {
    constructor(stateKey, redirectUrl, clientId, clientSecret, scope, authUrl, tokenUrl) {
        this.stateKey = stateKey
        this.redirectUrl = redirectUrl
        this.clientId = clientId
        this.clientSecret = clientSecret
        this.scope = scope
        this.authUrl = authUrl
        this.tokenUrl = tokenUrl
        this.cache = new Cache()
    }

    login() {
        const state = generateRandomString(16);

        const myCookie = cookie.serialize(this.stateKey, state, {
            secure: true,
            httpOnly: true,
            path: '/',
        })

        const queryParams = querystring.stringify({
            response_type: 'code',
            client_id: this.clientId,
            scope: this.scope,
            redirect_uri: this.redirectUrl,
            state: state
        })

        return {
            statusCode: 302,
            headers: {
                'Set-Cookie': myCookie,
                Location: this.authUrl + '?' + queryParams
            }
        }
    }

    callback(event) {
        const code = event.queryStringParameters.code || null;

        const authOptions = {
            url: this.tokenUrl,
            form: {
                code: code,
                client_id: this.clientId,
                client_secret: this.clientSecret,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (Buffer.from(this.clientId + ':' + this.clientSecret).toString('base64'))
            },
            json: true
        };

        return new Promise(function(resolve, reject) {

            request.post(authOptions, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    const accessToken = body.access_token;
                    this.cache.set(K_ACCESS_TOKEN, accessToken)
                    resolve(body)
                }
                // Invalid token
                else {
                    reject(error)

                }
            });
        })
    }

    refresh() {
        const refresh_token = this.cache.get(K_REFRESH_TOKEN);

        if (refresh_token === undefined || refresh_token === null) {
            throw new Error("No token provided")
        }

        const authOptions = {
            url: this.tokenUrl,
            form: {
                grant_type: 'refresh_token',
                refresh_token: refresh_token,
                client_id: this.clientId,
                client_secret: this.clientSecret,
            },
            headers: {'Authorization': 'Basic ' + (Buffer.from(this.clientId + ':' + this.clientSecret).toString('base64'))},
            json: true
        };

        return new Promise(function(resolve, reject) {
            request.post(authOptions, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    this.cache.set(K_ACCESS_TOKEN, body.access_token)
                    resolve(body)
                }
                else {
                    reject(error)
                }
            });
        })
    }
}
