module.exports = class {

    accessToken;
    refreshToken;

    constructor(accessToken, refreshToken) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken
    }

    get accessToken() {
        return this.accessToken
    }

    get refreshToken() {
        return this.refreshToken
    }

    set accessToken(token) {
        if (token !== undefined && token !== null) {
            this.accessToken = token
        }
    }

    set refreshToken(token) {
        if (token !== undefined && token !== null) {
            this.refreshToken = token
        }
    }
}
