require('dotenv').config()
const {MongoClient, ObjectID} = require('mongodb');

const database = process.env.DB_NAME;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;

// const uri = `mongodb+srv://${user}:${password}@playground.eqgtb.mongodb.net/${database}?retryWrites=true&w=majority&`;

const makeURI = function(collection) {
    return `mongodb+srv://${user}:${password}@playground.eqgtb.mongodb.net/${database}?retryWrites=true&w=majority&`;
}

const getAllEntries = async function(collection) {
    const uri = makeURI(collection);
    try {
        const client = new MongoClient(uri, {useUnifiedTopology: true});
        await client.connect();
        const col = client.db(database).collection(collection);
        const cursor = col.find({}, {_id:1});
        return await cursor.toArray();
    } catch (e) {
        console.log(e);
    }
}

const insertEntry = async function(entry, collection) {
    const uri = makeURI(collection);
    try {
        // Connect to the MongoDB cluster
        const client = new MongoClient(uri, {useUnifiedTopology: true});
        await client.connect();
        const col = client.db(database).collection(collection);
        await col.insertOne(entry);
    } catch (e) {
        console.log(e);
    }
}

const deleteEntry = async function(entry, collection) {
    const uri = makeURI(collection);
    try {
        // Connect to the MongoDB cluster
        const client = new MongoClient(uri, {useUnifiedTopology: true});
        await client.connect();
        const col = client.db(database).collection(collection);
        await col.deleteOne({_id: new ObjectID(entry)});
    } catch (e) {
        console.log(e);
    }
}

const getMostRecentEntry = async function(field, collection) {
    const uri = makeURI(collection);
    try {
        const client = new MongoClient(uri, {useUnifiedTopology: true});
        await client.connect();
        const col = client.db(database).collection(collection);
        const cursor = col.find().sort({field: -1}).limit(1);
        return await cursor.toArray()
    } catch (e) {
        console.log(e);
    }
}

const getFiltered = async function(filter, sortedField, collection) {
    const uri = makeURI(collection);
    try {
        const client = new MongoClient(uri, {useUnifiedTopology: true});
        await client.connect();
        const col = client.db(database).collection(collection);
        const cursor1 = col.find(filter).sort({sortedField: -1});
        const cursor2 = col.find().sort({sortedField: -1});
        const arr1 = await cursor1.toArray()
        const arr2 = await cursor2.toArray()
        return arr1
    } catch (e) {
        console.log(e);
    }
}



module.exports = {
    insertEntry: insertEntry,
    getAllEntries: getAllEntries,
    deleteEntry: deleteEntry,
    getMostRecentEntry: getMostRecentEntry,
    getFiltered: getFiltered
};
