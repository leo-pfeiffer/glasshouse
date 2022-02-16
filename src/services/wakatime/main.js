require('dotenv').config()
const { WakaTimeClient } = require('wakatime-client')
const { RANGE } = require('wakatime-client');
const {insertEntry} = require("../../db/dbconfig");
const Cache = require('../utils/cache')

const cache = new Cache();
const hashString = require('../utils/hashing')
const {getToday} = require("../utils/datetime");

const apiKey = process.env.WAKA_API_KEY
const collection = process.env.WAKA_COLLECTION;

const client = new WakaTimeClient(apiKey);

const getStats = async function() {
    const stats = await client.getMyStats({range: RANGE.LAST_30_DAYS});
    return stats
}

const getDailyAverage = function(stats) {
    return stats.data.daily_average
}

const getEditors = function(stats) {
    if (stats !== undefined & stats.data !== undefined & stats.data.editors !== undefined) {
        return reduceToArray(stats.data.editors)
    }

    return [];
}
const getTotalDuration = function(stats) {
    return stats.data.total_seconds
}

const getLanguages = function(stats) {
    if (stats !== undefined & stats.data !== undefined & stats.data.languages !== undefined) {
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
 * Write new wakatime entries to the database.
 * */
const write = function() {
    makeEntry(getToday())
        .then(entry => insertEntry(entry, collection))
        .then(() => console.log("Success!"))
        .catch((e) => console.error(e))
}

/**
 * Read wakatime entries from API or cache.
 * */
const read = async function() {
    const key = hashString(getToday().toString())

    if (cache.has(key)) {
        return cache.get(key)
    } else {
        const entry = await makeEntry(getToday())
        const ttl = cache.ttlEndOfDay()
        cache.set(key, entry, ttl)
        return entry
    }
}

module.exports = {
    write: write,
    read: read
};


