/**
 * 结合
 */
const mongoose  = require('mongoose');
const classifySchema = require('../schemas/classify');

module.exports = mongoose.model("classifySchema",classifySchema);