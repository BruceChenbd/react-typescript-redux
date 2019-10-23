/***
 * 新建文章数据
 */

const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    userId: String,
    category_id: String,
    content: String,
    cover_image: String,
    desc: String,
    tag_ids: Array,
    title: String,
    createTime: String,
    createTimeD: String,
    updateTime: String,
    updateTimeD: String
})