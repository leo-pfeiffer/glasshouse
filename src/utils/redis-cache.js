const redis = require('redis');
const {cors_headers} = require("./cors");

const host = process.env.REDIS_HOST
const port = process.env.REDIS_PORT
const user = process.env.REDIS_USER
const password = process.env.REDIS_PASSWORD

const client = redis.createClient({
    url: `redis://${user}:${password}@${host}:${port}`
});


client.on('connect', () => console.log('Connected!'));
client.on('error', (err) => console.log('Redis Client Error', err));

const setCache = async function (key, value, ttl) {
    if (!client.isOpen) {
        await client.connect();
    }
    await client.set(key, value);
    await client.expire(key, ttl)
}

const getCache = async function (key, parseAsObject) {
    if (!client.isOpen) {
        await client.connect();
    }
    const result = await client.get(key);
    if (result != null && parseAsObject) {
        return JSON.parse(result)
    }
    return result;
}

/**
 * Cache middleware that checks if the URL of the event has been cached before,
 * and if so returns the result
 * */
const withCache = func => (a, b) => {
    const handler = {
        apply: async (target, thisArg, args) => {
            const key = args[0].rawUrl
            let data = await getCache(key, true);
            if (data !== null) {
                return {
                    statusCode: 200,
                    body: JSON.stringify(data),
                    headers: cors_headers
                }
            }
            return target(args[0], args[1])
        }
    }

    const proxy = new Proxy(func, handler)
    console.log("after proxy")

    return proxy.apply(this, [a, b])
}

module.exports = {
    setCache: setCache, getCache: getCache, withCache: withCache
}