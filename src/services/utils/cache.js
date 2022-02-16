const NodeCache = require( "node-cache" );

/**
 * Exposes a wrapper for a caching mechanism. Right now, node-cache is used
 * but the wrapper would allow future use of something more sophisticated
 * such as Redis.
 * */
module.exports = class {

    provider = new NodeCache();

    set(key, val) {
        this.provider.set(key, val)
    }

    set(key, val, ttl) {
        this.provider.set(key, val, ttl)
    }

    mset(arr) {
        this.provider.mset(arr);
    }

    get(key) {
        return this.provider.get(key)
    }

    take(key) {
        return this.provider.take(key)
    }

    mget(keys) {
        return this.provider.mget(keys)
    }

    del(key) {
        this.provider.del(key)
    }

    mdel(keys) {
        this.provider.mdel(keys)
    }

    ttl(key, ttl) {
        this.provider.ttl(key, ttl)
    }

    getTtl(key) {
        return this.provider.getTtl(key)
    }

    keys() {
        return this.provider.keys()
    }

    has(key) {
        return this.provider.has(key)
    }

    flushAll() {
        this.provider.flushAll()
    }

    /**
     * Returns seconds until the end of the current day for timeouts
     * */
    ttlEndOfDay() {
        const d = new Date();
        const h = d.getHours();
        const m = d.getMinutes();
        const s = d.getSeconds();
        return (24*60*60) - (h*60*60) - (m*60) - s;
    }

}