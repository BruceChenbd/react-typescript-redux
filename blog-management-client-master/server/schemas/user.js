/**
 * 用户注册 集合数据结构
 */
const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    username: String,
    password: String,
    type: String, // 管理 ，普通用户
    email: String,
    nickname: String,
    website: String,
    profile: String,
    avatar_image: String,
})