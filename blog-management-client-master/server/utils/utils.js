const crypto = require('crypto');

module.exports = {
    MD5_KEY: 'cbd宝哥哥是这个世界上最帅的男人，将来也是最有钱的男人',
    md5 : (pwd) => {
      let md5 = crypto.createHash('md5');
      return md5.update(pwd).digest('hex')
    },
    responseClient(res,httpCode = 500,code = 3,message = '服务器异常',data = {}) {
        let responseData = {};
        responseData.code = code;
        responseData.message = message;
        responseData.data = data;
        res.status(httpCode).json(responseData)
    },
    getDateStr(seconds){
        let date = new Date(seconds*1000)
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        let minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        let second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        let currentTime = year + "-" + month + "-" + day + "  " + hour + ":" + minute + ":" + second;
        return currentTime
   }
}