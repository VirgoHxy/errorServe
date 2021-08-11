const fs = require('fs');
const path = require('path');

let writeByPathSync = (paramPath, contentStr, replaceFlag) => {
  try {
    let write = function (str, appendFlag) {
      if (str.match(/[^\\/]*$/)[0].indexOf(".") != -1) {
        if (contentStr) {
          if (!appendFlag || replaceFlag) {
            fs.writeFileSync(str, contentStr, "utf8");
          } else {
            fs.appendFileSync(str, "\r\n" + contentStr, "utf8");
          }
        } else {
          console.error(paramPath + " 写入内容为空");
        }
      } else {
        if (!appendFlag) {
          fs.mkdirSync(str);
        } else {
          console.error(paramPath + " 路径已存在");
        }
      }
    };
    if (!fs.existsSync(paramPath)) {
      paramPath = paramPath.replace(/\\\\|\\/g, "/");
      let pathArr = paramPath.split("/");
      let pathStr = pathArr[0];
      pathArr.splice(0, 1);
      while (pathArr.length > 0) {
        pathStr += "/" + pathArr[0];
        if (!fs.existsSync(pathStr)) {
          write(pathStr);
        }
        pathArr.splice(0, 1);
      }
    } else {
      write(paramPath, true);
    }
  } catch (error) {
    console.log(error);
  }
};

let readDBFileSync = function (pathParam) {
  try {
    let filePath = path.resolve("./db", pathParam);
    let result = "";
    if (!fs.existsSync(filePath)) {
      return result;
    }
    result = fs.readFileSync(filePath, "utf8") || "";
    result = typeof result == "string" && result ? JSON.parse(result) : result;
    return result;
  } catch (error) {
    console.error(error);
    return false;
  }
};

let writeDBFileSync = function (pathParam, str, replaceFlag) {
  try {
    let filePath = path.resolve("./db", pathParam);
    str = typeof str == "string" ? str : JSON.stringify(str);
    writeByPathSync(filePath, str, replaceFlag);
  } catch (error) {
    console.error(error);
    return false;
  }
};

module.exports = {
  writeByPathSync,
  readDBFileSync,
  writeDBFileSync
};