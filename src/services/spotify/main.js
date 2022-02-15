require('dotenv').config();
const request = require('request');
const {cache, refresh} = require("./auth");


const spotifyClient = async function(req, res, url) {

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

const getData = function (req, res) {
    const url = 'https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=5'
    return spotifyClient(req, res, url)
}

const getCurrentlyPlaying = async function(req, res) {
    const url = 'https://api.spotify.com/v1/me/player/currently-playing?market=GB&additional_types=track%2Cepisode'
    const raw = await spotifyClient(req, res, url)
    const data = {}

    data['spotify_url'] = raw.item.external_urls.spotify
    data['name'] = raw.item.name
    data['is_playing'] = raw.is_playing

    // episode
    if (raw.currently_playing_type === 'episode') {
        data['type'] = 'episode'
        data['image'] = raw.item.images[0]
        data['show'] = raw.item.show.name
    }

    // track
    else {
        data['type'] = 'track'
        data['artists'] = raw.item.artists.map(e => e.name)
        data['image'] = raw.item.album.images[0]
        data['popularity'] = raw.item.popularity
    }

    return data
}


module.exports = {
    getData,
    getCurrentlyPlaying
}
