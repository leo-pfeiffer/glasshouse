const retrieve = function () {
    return fetch("https://glasshouse-341514.nw.r.appspot.com/api/v1/spotify/currently-playing")
        .then(res => res.json())
        .catch(() => {})

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
}

module.exports = {retrieve}