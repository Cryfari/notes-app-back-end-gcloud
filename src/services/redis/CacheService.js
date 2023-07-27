const redis = require('redis');
/**
 * Cache service
 */
class CacheSevice {
  /**
   * cobstuctor
   */
  constructor() {
    this._client = redis.createClient({
      socket: {
        host: process.env.REDIS_SERVER,
      },
    });
    this._client.on('error', (error) => {
      console.error(error);
    });
    this._client.connect();
  }

  /**
   * @param {any} key
   * @param {any} value
   * @param {integer} expirationInSecond
   */
  async set(key, value, expirationInSecond = 3600) {
    await this._client.set(key, value, {
      EX: expirationInSecond,
    });
  }

  /**
   * @param {any} key
   */
  async get(key) {
    const result = await this._client.get(key);

    if (result === null ) {
      throw new Error('Cache tidak ditemukan');
    }
    return result;
  }

  /**
   * @param {any} key
   * @return {integer}
   */
  delete(key) {
    return this._client.del(key);
  }
}

module.exports = CacheSevice;
