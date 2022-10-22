require('dotenv').config()
const {WakaTimeClient} = require('wakatime-client')
const {RANGE} = require('wakatime-client');
const hashString = require('../../utils/hashing')
const {getToday, secondsUntilEndOfDay} = require("../../utils/datetime");
const Cache = require('../../utils/cache')

const cache = new Cache();

const API_KEY = process.env.WAKA_API_KEY

const client = new WakaTimeClient(API_KEY);

const getStats = function() {
    return client.getMyStats({range: RANGE.LAST_30_DAYS})
}

const getDailyAverage = function(stats) {
    return stats.data.daily_average
}

const getEditors = function(stats) {
    if (stats !== undefined & stats.data !== undefined && stats.data.editors !== undefined) {
        return reduceToArray(stats.data.editors)
    }

    return [];
}
const getTotalDuration = function(stats) {
    return stats.data.total_seconds
}

const getLanguages = function(stats) {
    if (stats !== undefined & stats.data !== undefined && stats.data.languages !== undefined) {
        return reduceToArray(stats.data.languages)
    }

    return [];
}

const reduceToArray = function(array) {
    return array.reduce((arr, item) => {
        const obj = {}
        obj["name"] = item.name;
        obj["total"] = item.total_seconds;
        arr.push(obj)
        return arr;
    }, [])
}

const makeEntry = async function(date) {
    const stats = await getStats()
    return {
        date: date,
        total: getTotalDuration(stats),
        average: getDailyAverage(stats),
        editors: getEditors(stats),
        languages: getLanguages(stats)
    }
}


/**
 * Read wakatime entries from API or cache.
 * */
const read = async function() {
    const key = hashString(getToday().toString())

    if (cache.has(key)) return cache.get(key)

    const entry = await makeEntry(getToday())
    const ttl = secondsUntilEndOfDay()
    cache.set(key, entry, ttl)
    return entry
}

module.exports = {
    read: read
};


