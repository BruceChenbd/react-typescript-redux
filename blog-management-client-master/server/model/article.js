/**
 * 结合
 */
const mongoose  = require('mongoose');
const articleSchema = require('../schemas/article');

module.exports = mongoose.model("articleSchema",articleSchema);