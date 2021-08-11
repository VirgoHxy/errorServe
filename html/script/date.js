!(function () {
  "use strict";

  /**
   * 获取合规时间
   * 
   * @param {Date | String | Number} value 时间字符串
   * 
   * @returns {Date} 返回时间对象
   */
  function getRegularTime(value) {
    let getType = function(o) {
      let s = Object.prototype.toString.call(o);
      return s.match(/\[object (.*?)\]/)[1].toLowerCase();
    };
  
    if (getType(value) == "string") {
      let ms = value.match(/\.([\d]{1,})[Z]*/) ? value.match(/\.([\d]{1,})[Z]*/)[1] : 0;
      if (/T/g.test(value)) { // 去T
        value = value.replace(/T/g, " ");
      }
      if (/\./g.test(value)) { // 去毫秒 兼容ios ie firefox
        value = value.replace(/\.[\d]{1,}[Z]*/, "");
      }
      if (/-/g.test(value)) { // new Date兼容ios ie firefox
        value = value.replace(/-/g, "/");
      }
      let date = new Date(value);
      date.setMilliseconds(ms);
      return date;
    } else if(getType(value) == "number") {
      return new Date(value);
    } else if(getType(value) == "date") {
      return value;
    } else {
      return false;
    }
  }

  /**
   * 格式化时间(依赖getRegularTime方法)
   * 
   * @param {Date | String | Number} value 时间值
   * @param {String} [formatStr = "YYYY-MM-DD hh:mm:ss"] 格式化规则
   * 
   * @returns {String} 返回字符串时间
   */
  function format(value, formatStr) {
    let myDate = getRegularTime(value);
    if (typeof myDate == "boolean") { return "请输入正确的日期"; }
    if (isNaN(myDate.getTime())) { return "请输入正确的日期"; }
    let str = formatStr || "YYYY-MM-DD hh:mm:ss",
      week = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
      fullYear = myDate.getFullYear(),
      year = Number(String(fullYear).substring(2)),
      month = myDate.getMonth(),
      date = myDate.getDate(),
      day = myDate.getDay(),
      hour = myDate.getHours(),
      minute = myDate.getMinutes(),
      second = myDate.getSeconds(),
      mSecond = myDate.getMilliseconds();
    //四位年份
    str = str.replace(/yyyy|YYYY/, fullYear);
    //两位年份，小于10补零
    str = str.replace(/yy|YY/, year > 9 ? year : "0" + year);
    //月份，小于10补零
    str = str.replace(/MM/, (month + 1) > 9 ? month + 1 : "0" + (month + 1));
    //月份，不补零
    str = str.replace(/\bM\b/, month + 1);
    //日期，小于10补零
    str = str.replace(/dd|DD/, date > 9 ? date : "0" + date);
    //日期，不补零
    str = str.replace(/d|D/, date);
    //小时，小于10补零
    str = str.replace(/hh|HH/, hour > 9 ? hour : "0" + hour);
    //小时，不补零
    str = str.replace(/h|H/, hour);
    //分钟，小于10补零
    str = str.replace(/mm/, minute > 9 ? minute : "0" + minute);
    //分钟，不补零
    str = str.replace(/\bm\b/, minute);
    //秒钟，小于10补零
    str = str.replace(/ss|SS/, second > 9 ? second : "0" + second);
    //秒钟，不补零
    str = str.replace(/\bs\b|\bS\b/, second);
    //星期几
    str = str.replace(/w|W/g, week[day]);
    //毫秒，小于9或99补零
    str = str.replace(/MS/, mSecond > 9 ? mSecond > 99 ? mSecond : "0" + mSecond : "00" + mSecond);
    //毫秒，不补零
    str = str.replace(/ms/, mSecond);
    return str;
  }

  
  let global = (function () { return this || (0, eval)('this'); }());
  let JAFODateMethod = {
    getRegularTime,
    format
  };

  // 最后将插件对象暴露给全局对象
  if (typeof module !== "undefined" && module.exports) {
    module.exports = JAFODateMethod;
  } else if (typeof define === "function" && define.amd) {
    define(function () { return JAFODateMethod; });
  } else {
    !('JAFODateMethod' in global) && (global.JAFODateMethod = JAFODateMethod);
  }
}());