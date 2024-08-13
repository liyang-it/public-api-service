/**
 * 缓存实现,node-cache文档： https://www.npmjs.com/package/node-cache
 */
const NodeCache = require("node-cache");
// 缓存过期时间(秒)
const ttl = 28800;
const myCache = new NodeCache({
  stdTTL: ttl,
  checkperiod: 120
});
const cacheHandler = {
  setCache: function (key, data, dataTtl) {
    myCache.set(key, data, dataTtl || ttl)
  },
  getCache: function (key) {
    const get = myCache.get(key) || null
    return get
  }
}
module.exports = cacheHandler