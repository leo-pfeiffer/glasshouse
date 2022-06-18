const {BASE_URL} = require("@/api/settings");
const retrieve = function (url) {
    return fetch(url)
        .then(res => res.json())
        .catch(() => {
        })
}

const getCurrentlyPlaying = function () {
    const url = `${BASE_URL}/api/v1/spotify/currently-playing`
    return retrieve(url)
}


const getTopArtists = async function () {
    const url = `${BASE_URL}/api/v1/spotify/top-artists`
    let artists = await retrieve(url)
    artists = artists.items
    return artists.slice(0, Math.min(5, artists.length))
}

const getTopTracks = async function () {
    const url = `${BASE_URL}/api/v1/spotify/top-tracks`
    let tracks = await retrieve(url)
    tracks = tracks.items
    return tracks.slice(0, Math.min(5, tracks.length))
}

const getRecentlyPlayed = async function () {
    const url = `${BASE_URL}/api/v1/spotify/recently-played`
    let tracks = await retrieve(url)
    tracks = tracks.items
    return tracks.slice(0, Math.min(5, tracks.length))
}

// // track
// return {
//     "spotify_url": "https://open.spotify.com/track/6supMAknraGpJrN5qqYfV8",
//     "name": "Good Form (feat. Lil Wayne) - Remix",
//     "is_playing": true,
//     "type": "track",
//     "artists": ["Nicki Minaj", "Lil Wayne"],
//     "image": {
//         "height": 640,
//         "url": "https://i.scdn.co/image/ab67616d0000b273fc8c64bfc4323ff7ce68fea8",
//         "width": 640
//     },
//     "popularity": 69
// }

// episode
// return {
//     "spotify_url": "https://open.spotify.com/episode/5QXcfQVQjdZzjXuhapb0JL",
//     "name": "Coinbase: Brian Armstrong",
//     "is_playing": true,
//     "type": "episode",
//     "image": {
//         "height": 640,
//         "url": "https://i.scdn.co/image/ab6765630000ba8a149b360b57670adbf6d47d63",
//         "width": 640
//     },
//     "show": "How I Built This with Guy Raz"
// }


module.exports = {getTopArtists, getTopTracks, getCurrentlyPlaying, getRecentlyPlayed}