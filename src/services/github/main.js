const axios = require("axios")
const hashString = require('../../utils/hashing')
const {getToday, minusOneMonth, secondsUntilEndOfDay} = require("../../utils/datetime");
const Cache = require("../../utils/cache");

const cache = new Cache();

const getStats = function() {
    const url = "https://github-stats-rest.vercel.app/api?username=leo-pfeiffer&count_private=true&show_icons=true"
    return axios.get(url)
        .then((res) => res.data)
        .catch((err) => console.error(err))
}

const getLangs = function() {
    const url = "https://github-stats-rest.vercel.app/api/top-langs/?username=leo-pfeiffer&layout=compact&hide=Jupyter%20Notebook,HTML,CSS&exclude_repo=Functional-Programming-in-Scala"
    return axios.get(url)
        .then((res) => res.data)
        .catch((err) => console.error(err))
}

/**
 * Read wakatime entries from API or cache.
 * */
const read = async function() {

    const key = hashString(getToday().toString())
    if (cache.has(key)) return cache.get(key)

    const stats = await getStats();
    const langs = await getLangs();

    const data = {
        ...stats, ...langs
    }

    const ttl = secondsUntilEndOfDay()
    cache.set(key, data, ttl)
    return data
}

module.exports = {
    read: read
};
