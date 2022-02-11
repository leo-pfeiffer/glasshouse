const moment = require("moment");

const retrieve = function () {
    const arr = [{
        "_id": "620285cd86097cb4c4b142da",
        "maxHeartRate": {"units": "bpm", "qty": 151},
        "avgHeartRate": {"units": "bpm", "qty": 127.83678343949036},
        "totalEnergy": {"qty": 2205.0324457736133, "units": "kJ"},
        "activeEnergy": {"units": "kJ", "qty": 1859.8231577736167},
        "start": "2022-01-25 07:11:01 +0000",
        "end": "2022-01-25 07:52:24 +0000",
        "name": "Cycling",
        "intensity": {"units": "MET", "qty": 10.03267415719095}
    }, {
        "_id": "620285cd86097cb4c4b142db",
        "maxHeartRate": {"qty": 142, "units": "bpm"},
        "avgHeartRate": {"qty": 120.56948228882837, "units": "bpm"},
        "totalEnergy": {"qty": 281.8492452695864, "units": "kJ"},
        "activeEnergy": {"units": "kJ", "qty": 160.14505326958653},
        "start": "2022-01-11 21:10:08 +0000",
        "end": "2022-01-11 21:15:41 +0000",
        "name": "Other",
        "intensity": {"units": "MET", "qty": 9.50348197469224}
    }, {
        "_id": "620285cd86097cb4c4b142dc",
        "maxHeartRate": {"qty": 145, "units": "bpm"},
        "avgHeartRate": {"qty": 99.46160302140154, "units": "bpm"},
        "totalEnergy": {"qty": 1349.1308000000033, "units": "kJ"},
        "activeEnergy": {"qty": 1031.1049600000067, "units": "kJ"},
        "start": "2022-01-24 22:18:33 +0000",
        "end": "2022-01-24 23:00:38 +0000",
        "name": "Traditional Strength Training",
        "intensity": {"qty": 4.759437009236253, "units": "MET"}
    }, {
        "_id": "620285cd86097cb4c4b142dd",
        "maxHeartRate": {"qty": 143, "units": "bpm"},
        "avgHeartRate": {"qty": 101.335187354346, "units": "bpm"},
        "totalEnergy": {"units": "kJ", "qty": 1226.941626806189},
        "activeEnergy": {"qty": 897.4767308061919, "units": "kJ"},
        "start": "2022-01-17 06:58:31 +0000",
        "end": "2022-01-17 07:39:07 +0000",
        "name": "Traditional Strength Training",
        "intensity": {"qty": 3.45814568637808, "units": "MET"}
    }, {
        "_id": "620285cd86097cb4c4b142de",
        "maxHeartRate": {"qty": 129, "units": "bpm"},
        "avgHeartRate": {"units": "bpm", "qty": 104.50467289719623},
        "totalEnergy": {"qty": 558.9991360000007, "units": "kJ"},
        "activeEnergy": {"qty": 369.59782400000034, "units": "kJ"},
        "start": "2022-01-31 07:37:42 +0000",
        "end": "2022-01-31 07:53:12 +0000",
        "name": "Core Training",
        "intensity": {"qty": 5.961622451710051, "units": "MET"}
    }]

    for (let w of arr) {
        w['start'] = moment(w.start, "YYYY-MM-DD hh:mm:ss Z").toDate();
        w['end'] = moment(w.end, "YYYY-MM-DD hh:mm:ss Z").toDate();
        w['duration'] = getWorkoutDuration(w)
    }

    arr.sort((a, b) => a.start < b.start ? 1 : -1)

    return arr;
}

const diffMins = function (date1, date2) {
    const diffMs = date2 - date1
    console.log(date1, date2, diffMs)
    return Math.round(((diffMs % 86400000) % 3600000) / 60000);
}

const getWorkoutProportions = function(workouts) {
    const total = getTotalWorkoutTime(workouts)
    return workouts.reduce((acc, curr) => {
        const duration = Math.floor((getWorkoutDuration(curr) / total) * 100) / 100;
        acc[curr.name] ? acc[curr.name] += duration : acc[curr.name] = duration
        return acc
    }, {});
}

const getWorkoutDuration = function(workout) {
    return diffMins(workout.start, workout.end)
}

const getTotalWorkoutTime = function(workouts) {
    return workouts.reduce((a, b) => {
        return a + getWorkoutDuration(b)
    }, 0);
}

const getMaxBPM = function(workouts) {
    return workouts.reduce((a, b) => b.maxHeartRate.qty > a ? b.maxHeartRate.qty : a, 0)
}

module.exports = {
    retrieve,
    getWorkoutProportions,
    getTotalWorkoutTime,
    getMaxBPM
}