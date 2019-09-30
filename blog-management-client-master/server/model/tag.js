const mongoose  = require('mongoose');
const tagSchema = require('../schemas/tag');

module.exports = mongoose.model("tagSchema",tagSchema);