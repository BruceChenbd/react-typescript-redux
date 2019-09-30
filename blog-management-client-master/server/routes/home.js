var express = require('express');
var router = express.Router();
const  {MD5_KEY,responseClient,md5}  = require('../utils/utils')
const classifySchema = require('../model/classify');
const tagSchema = require('../model/tag');
const articleSchema = require('../model/article');

// const totalNumArr = [
//     {
//         article_total:100
//     },
//     {
//         category_total: 50
//     },
//     {
//         tag_total:10
//     },
//     {
//         comment_total: 50
//     }
// ]

// 查询首页文章，分类，标签，评论总数
router.get('/getArticleNum', (req,res) => {
    let tokenAndUserId = req.headers['x-auth-token']; // 从Authorization中获取token
    let token = tokenAndUserId.split('&&')[1];
    let userId = tokenAndUserId.split('&&')[0];
    let dashData = {};
    classifySchema.countDocuments({userId}).then(count => {
        dashData.category_total = count;
       tagSchema.countDocuments({userId}).then(count => {
            dashData.tag_total = count;
            articleSchema.countDocuments({userId}).then(count => {
                dashData.article_total = count;
                dashData.comment_total = 50;
                responseClient(res, 200, 0, dashData)
            }).catch(err => {
                responseClient(res)
            })
       }).catch(err => {
            responseClient(res)
       })
    }).catch(err => {
        responseClient(res)
    })
})


module.exports = router;