/**
 * 通用响应请求
 */
const responseHandler = {
  /**
   * 通用 响应 成功消息结果
   * @param {*} res response对象
   * @param {*} message 返回消息, null 默认 "请求成功"
   * @param {*} cache 响应的数据是否缓存, null 默认 "false"
   * @param {*} data  响应的数据, null 默认 "null"
   */
  success: function (res, message, cache, data) {
    const result = {
      code: 200,
      message: message || '请求成功',
      cache: cache || false,
      data: data || null
    };
    res.json(result);
  },
    /**
   * 通用 响应 成功消息结果
   * @param {*} res response对象
   * @param {*} message 返回消息, null 默认 "请求成功"
   * @param {*} data  响应的数据, null 默认 "null"
   */
  fail: function (res, message, data) {
    const result = {
      code: 500,
      message: message || '请求异常',
      data: data || null
    };
    res.json(result);
  }
}
module.exports = responseHandler;