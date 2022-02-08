require('dotenv').config()
const { WakaTimeClient } = require('wakatime-client')
const { RANGE } = require('wakatime-client');
const {insertEntry, getMostRecentEntry} = require("../../db/dbconfig");

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

const getToday = function() {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate())
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
 * Read wakatime entries from the db
 * */
const read = async function() {
    const entry = await getMostRecentEntry("date", collection);
    console.log(entry)
    return entry
}

module.exports = {
    write: write,
    read: read
};


