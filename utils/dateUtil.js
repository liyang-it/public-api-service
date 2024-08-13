/**
 * 日期操作通用
 */
const dateUtil = {
  getNowDate: function () {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() 返回的是 0-11 的月份，所以需要加 1
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`
  },
  getNowMonth: function () {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() 返回的是 0-11 的月份，所以需要加 1
    return `${year}-${month}`
  },
  getNowMonthMinOne: function () {
    const date = new Date();
    const year = date.getFullYear();
    // 不需要加1，返回上一个月
    const month = (date.getMonth()).toString().padStart(2, '0');
    return `${year}-${month}`
  }
}

module.exports = dateUtil