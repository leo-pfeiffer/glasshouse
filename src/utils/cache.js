const NodeCache = require( "node-cache" );

/**
 * Exposes a caching wrapper.
 * */
module.exports = class {

    provider = new NodeCache();

    set(key, val) {
        this.provider.set(key, val)
    }

    set(key, val, ttl) {
        this.provider.set(key, val, ttl)
    }

    get(key) {
        return this.provider.get(key)
    }

    has(key) {
        return this.provider.has(key)
    }
}