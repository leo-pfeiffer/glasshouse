const {BASE_URL} = require("@/api/settings");

const retrieve = async function (days) {
    let arr = await fetch(`${BASE_URL}/api/v1/strava/activities`)
        .then(res => res.json())
        .catch(() => [])

    for (let w of arr) {
        w['start_date'] = new Date(w["start_date"])
    }

    arr.sort((a, b) => a["start_date"] < b["start_date"] ? 1 : -1)

    return arr.filter(e => diffDays(e["start_date"]) < days)
}

const diffDays = (d) => {
    const diffTime = Math.abs(new Date() - d);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

const getDaysArray = function(start, end) {
    let arr=[]
    for (let dt = new Date(start); dt <= new Date(end); dt.setDate(dt.getDate() + 1)){
        arr.push(new Date(dt));
    }
    return arr;
};

const getDurationTimeSeries = function(activities) {

    let minDay = new Date()
    let maxDay = new Date(2000, 1, 1)
    let dateAgg = {}

    for (let activity of activities) {

        let date = activity["start_date"]

        if (date <= minDay) minDay = date
        if (date >= maxDay) maxDay = date

        const dateString = date.toISOString().slice(0,10)
        if (date in dateAgg) {
            dateAgg[dateString] += activity["duration"]
        } else {
            dateAgg[dateString] = activity["duration"]
        }

    }
    const daysArray = getDaysArray(minDay, maxDay)

    let result = []
    for (let day of daysArray) {
        const dayString = day.toISOString().slice(0,10)
        result.push({"date": day, "duration": dayString in dateAgg ? dateAgg[dayString] : 0})
    }
    return result
}


const getTotalWorkoutTime = function(activities) {
    return activities.reduce((a, b) => {
        return a + b["duration"]
    }, 0);
}

const getMaxBPM = function(activities) {
    return activities.reduce((a, b) => b["max_hr"] > a ? b["max_hr"] : a, 0)
}

module.exports = {
    retrieve,
    getTotalWorkoutTime,
    getMaxBPM,
    getDurationTimeSeries
}