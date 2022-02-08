require('dotenv').config()
const {insertEntry, getFiltered} = require("../../db/dbconfig");

const collection = process.env.FITNESS_COLLECTION;

const getWorkouts = function(body) {
    return body.data.workouts;
}

const cleanWorkout = function(workout) {
    return {
        maxHeartRate: workout.maxHeartRate,
        avgHeartRate: workout.avgHeartRate,
        totalEnergy: workout.totalEnergy,
        activeEnergy: workout.activeEnergy,
        start: workout.start,
        end: workout.end,
        name: workout.name,
        intensity: workout.intensity,
    }
}

const write = async function (rawWorkouts) {
    getWorkouts(rawWorkouts).map(cleanWorkout).map(w => insertEntry(w, collection))
}

/**
 * Read fitness entries from the db
 * */
const read = async function() {

    // Date from one mont ago
    const date = new Date();
    date.setMonth(date.getMonth() - 1);

    // all entries last month
    const filter = {"start": {$gte: date.toISOString()}}

    const workouts = await getFiltered(filter, "start", collection);
    return workouts
}

module.exports = {
    read: read,
    write: write
};
