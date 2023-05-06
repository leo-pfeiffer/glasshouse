const retrieve = function (url) {
    return fetch(url)
        .then(res => res.json())
        .catch(() => {
        })
}

const getCurrentlyPlaying = function () {
    const url = "/api/v1/spotify/currently-playing"
    return retrieve(url)
}


const getTopArtists = async function () {
    const url = "/api/v1/spotify/top-artists"
    let artists = await retrieve(url)
    artists = artists.items
    return artists.slice(0, Math.min(5, artists.length))
}

const getTopTracks = async function () {
    const url = "/api/v1/spotify/top-tracks"
    let tracks = await retrieve(url)
    tracks = tracks.items
    return tracks.slice(0, Math.min(5, tracks.length))
}

const getRecentlyPlayed = async function () {
    const url = "/api/v1/spotify/recently-played"
    let tracks = await retrieve(url)
    tracks = tracks.items
    return tracks.slice(0, Math.min(5, tracks.length))
}

module.exports = {getTopArtists, getTopTracks, getCurrentlyPlaying, getRecentlyPlayed}