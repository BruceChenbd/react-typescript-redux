/**
 * 用户注册 集合数据结构
 */
const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    userId:String,
    tagName: String,
    createTime: String,
    updateTime: String,
    total: Number,
})