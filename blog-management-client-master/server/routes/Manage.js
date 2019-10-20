var express = require('express');
var router = express.Router();
var fs = require('fs');
var formidable = require('formidable');
var sd = require('silly-datetime');
const classifySchema = require('../model/classify');
const tagSchema = require('../model/tag');
const articleSchema = require('../model/article');
const { MD5_KEY,responseClient,md5,getDateStr }  = require('../utils/utils');

// 分类管理 /***start */

// 添加分类
router.post('/addCategory', (req,res) => {
    let tokenAndUserId = req.headers['x-auth-token']; // 从Authorization中获取token
    let token = tokenAndUserId.split('&&')[1];
    let userId = tokenAndUserId.split('&&')[0];

    let { name,desc} = req.body;
    const now = new Date(); 
    var timeStr = getDateStr(now.getTime()/1000);
    let model = new classifySchema({
        userId,
        categoryName:name,
        categoryDesc:desc,
        createTime:timeStr,
        updateTime:timeStr
    })
    model.save().then(data => {
        responseClient(res,200,0,'保存成功!')
    }).catch(err => {
        responseClient(err)
    })
})

// 查询分类
router.get('/getCategories', (req,res) => {
    let { name, pageNum, pageSize } = req.query;
    let skip = ( pageNum - 1) < 0 ? 0 : (pageNum - 1) * 5;
    let tokenAndUserId = req.headers['x-auth-token']; // 从Authorization中获取token
    let token = tokenAndUserId.split('&&')[1];
    let userId = tokenAndUserId.split('&&')[0];
    // 查询条件 name 不为空
    if(name != undefined && name != '') {
        let data = {};
        // 查询总数
        classifySchema.countDocuments({categoryName:name,userId}).then(count => {
            data.total = count;
            classifySchema.find({categoryName:name,userId}).skip(skip).limit(5).then(d => {
                if(JSON.stringify(d) == '[]') {
                    data.categoryArr = [];
                    responseClient(res,200,0,'暂无数据',data)
                } else {
                    data.categoryArr = d;
                    responseClient(res,200,0,'查询成功',data)
                }
            }) 
        }) 
    } else {
        let data = {};
        classifySchema.countDocuments({userId}).then(count => {
            data.total = count;
            classifySchema.find({userId}).skip(skip).limit(5).then(t => {
                    data.categoryArr = t
                    responseClient(res,200,0,'查询成功',data)
            }).catch(err => {
                responseClient(res)
            })
        }).catch(err => {
            responseClient(res)
        }) 
    }
})

// 修改分类
router.put('/updateCategory', (req,res) => {
    let { id, name ,desc} = req.body;
    const now = new Date(); 
    var timeStr = getDateStr(now.getTime()/1000);
    classifySchema.findOne({_id:id}).then(data => {
        classifySchema.update({_id:id}, {categoryName:name,categoryDesc:desc,updateTime:timeStr}).then(u => {
            responseClient(res,200,0,'更新成功!')
        }).catch(err => {
            responseClient(res)
        })
    }).catch(err => {
        responseClient(res)
    })
})
// 删除分类
router.delete('/delCategory/:id', (req,res) => {
    let { id } = req.params;
    classifySchema.remove({_id:id}).then(data => {
        if(data){
            responseClient(res,200,0,'删除成功!')
        }
    }).catch(err => {
        responseClient(err)
    })
})

/***end */

// 标签管理 /***start */

router.post('/addTag', (req,res) => {
    let tokenAndUserId = req.headers['x-auth-token']; // 从Authorization中获取token
    let token = tokenAndUserId.split('&&')[1];
    let userId = tokenAndUserId.split('&&')[0];

    let { tagName} = req.body;
    const now = new Date(); 
    var timeStr = getDateStr(now.getTime()/1000);
    let model = new tagSchema({
        userId,
        tagName,
        createTime:timeStr,
        updateTime:timeStr
    })
    model.save().then(data => {
        responseClient(res,200,0,'保存成功!')
    }).catch(err => {
        responseClient(err)
    })
})

// 查询分类
router.get('/getTag', (req,res) => {
    let { tagName, pageNum, pageSize } = req.query;
    let skip = ( pageNum - 1) < 0 ? 0 : (pageNum - 1) * 5;
    let tokenAndUserId = req.headers['x-auth-token']; // 从Authorization中获取token
    let token = tokenAndUserId.split('&&')[1];
    let userId = tokenAndUserId.split('&&')[0];
    // 查询条件 name 不为空
    if(tagName != undefined && tagName != '') {
        let data = {};
        // 查询总数
        tagSchema.countDocuments({tagName,userId}).then(count => {
            data.total = count;
            tagSchema.find({tagName,userId}).skip(skip).limit(5).then(d => {
                if(JSON.stringify(d) == '[]') {
                    data.tagArr = [];
                    responseClient(res,200,0,'暂无数据',data)
                } else {
                    data.tagArr = d;
                    responseClient(res,200,0,'查询成功',data)
                }
            }) 
        }) 
    } else {
        let data = {};
        tagSchema.countDocuments({userId}).then(count => {
            data.total = count;
            tagSchema.find({userId}).skip(skip).limit(5).then(t => {
                    data.tagArr = t
                    responseClient(res,200,0,'查询成功',data)
            }).catch(err => {
                responseClient(res)
            })
        }).catch(err => {
            responseClient(res)
        }) 
    }
})

// 修改分类
router.put('/updateTag', (req,res) => {
    let { id, tagName } = req.body;
    const now = new Date(); 
    var timeStr = getDateStr(now.getTime()/1000);
    tagSchema.findOne({_id:id}).then(data => {
        tagSchema.update({_id:id}, {tagName,updateTime:timeStr}).then(u => {
            responseClient(res,200,0,'更新成功!')
        }).catch(err => {
            responseClient(res)
        })
    }).catch(err => {
        responseClient(res)
    })
})
// 删除分类
router.delete('/delTag/:id', (req,res) => {
    let { id } = req.params;
    tagSchema.remove({_id:id}).then(data => {
        if(data){
            responseClient(res,200,0,'删除成功!')
        }
    }).catch(err => {
        responseClient(err)
    })
})

/***end */

/***文章管理 start */
// 上传封面图片
router.post('/upload', (req,res) => {

    let COVER_UPLOAD_FOLDER = '/cover';
    //创建上传表单
    var form = new formidable.IncomingForm();
    //设置编码格式
    form.encoding = 'utf-8';
    //设置上传目录
    form.uploadDir = './public' + COVER_UPLOAD_FOLDER;
    //保留后缀
    form.keepExtensions = true;
    //文件大小
    form.maxFieldsSize = 2 * 1024 * 1024;
    form.parse(req,function(err,fields,files){
    let filesFile = files.file
    if (err) {
      return res.json({
        status: 500,
        message: "内部服务器错误",
        result:''
      })
    }
    // 限制文件大小 单位默认字节 这里限制大小为2m
    if (filesFile.size > form.maxFieldsSize) {
      fs.unlink(filesFile.path)
      return res.json({
        data: {
            data:{},
            status: 1,
            message: "图片大小不能超过2M",
        }
      })
    }
    //后缀名
    var extName = '';
    switch (filesFile.type) {
      case 'image/pjpeg':
        extName = 'jpg';
        break;
      case 'image/jpeg':
        extName = 'jpg';
        break;
      case 'image/png':
        extName = 'png';
        break;
      case 'image/x-png':
        extName = 'png';
        break;
    }
    if (extName.length == 0) {
      return res.json({ 
        data: {
            data:{},
            status: 1,
            message: "只支持png和jpg格式图片",
        }
      })
    }
    //使用第三方模块silly-datetime
    var t = sd.format(new Date(), 'YYYYMMDDHHmmss');
    //生成随机数
    var ran = parseInt(Math.random() * 8999 + 10000);
    // 生成新图片名称
    var avatarName = t + '_' + ran + '.' + extName;
    // 新图片路径
    var newPath = form.uploadDir + '/' + avatarName;
    // 更改名字和路径
    fs.rename(filesFile.path, newPath, function (err) {
      if (err) {
        return res.json({
          "code": 401,
          "message": "图片上传失败"
        })
      } else{
        return res.json({
          data: {
             data: COVER_UPLOAD_FOLDER + '/' + avatarName,
             status: 0,
             message: "图片上传成功",
          }
       })
      }
    })
  })
})

// 新增文章
router.post('/addArticle', (req, res) => {
    let tokenAndUserId = req.headers['x-auth-token']; // 从Authorization中获取token
    let token = tokenAndUserId.split('&&')[1];
    let userId = tokenAndUserId.split('&&')[0];

    let { category_id, content, cover_image, desc, tag_ids, title } = req.body;
    const now = new Date(); 
    var timeStr = getDateStr(now.getTime()/1000);
    let model = new articleSchema({
        userId,
        category_id,
        content,
        cover_image,
        desc,
        tag_ids,
        title,
        createTime:timeStr,
        updateTime:timeStr
    })
    model.save().then(data => {
        responseClient(res,200,0,'保存成功!')
    }).catch(err => {
        responseClient(err)
    })
})

// 获取文章
router.get('/getArticleList', (req,res) => {
    let { title, tag_ids, created_start_at, updated_start_at, category_id, pageNum, pageSize } = req.query;
    let searchConditions = {};
    if(title) {
        searchConditions.title = title;
    }
    if(created_start_at) {
        searchConditions.createTime = created_start_at;
    }
    if(updated_start_at) {
        searchConditions.updated_start_at = updated_start_at;
    }
    if(category_id) {
        searchConditions.category_id = category_id;
    }
    if(tag_ids) {
        searchConditions.tag_ids = [tag_ids]
    }
    
    let skip = ( pageNum - 1) < 0 ? 0 : (pageNum - 1) * 5;
    let tokenAndUserId = req.headers['x-auth-token']; // 从Authorization中获取token
    let token = tokenAndUserId.split('&&')[1];
    let userId = tokenAndUserId.split('&&')[0];
    // 查询条件 name 不为空 
    let data = {};
    // 查询总数
    if(JSON.stringify(req.query) == '{}') {
        articleSchema.countDocuments({userId}).then(count => {
            data.total = count;
            articleSchema.find({userId}).skip(skip).limit(5).then(d => {
                if(JSON.stringify(d) == '[]') {
                    data.articleArr = [];
                    responseClient(res,200,0,'暂无数据',data)
                } else {
                    data.articleArr = d;
                    responseClient(res,200,0,'查询成功',data)
                }
            }) 
        }) 
    } else {
        articleSchema.countDocuments(searchConditions).then(count => {
            data.total = count;
            articleSchema.find(searchConditions).skip(skip).limit(5).then(d => {
                if(JSON.stringify(d) == '[]') {
                    data.articleArr = [];
                    responseClient(res,200,0,'暂无数据',data)
                } else {
                    data.articleArr = d;
                    responseClient(res,200,0,'查询成功',data)
                }
            }) 
        }) 
    }
})

// 删除文章
router.delete('/deleteArticle/:id', (req,res) => {
    let { id } = req.params;
    articleSchema.remove({_id:id}).then(data => {
        if(data){
            responseClient(res,200,0,'删除成功!')
        }
    }).catch(err => {
        responseClient(err)
    })
})

// 修改文章
router.post('/updateArticle', (req,res) => {
    let { id, category_id, content, cover_image, desc, tag_ids, title } = req.body;
    const now = new Date(); 
    var timeStr = getDateStr(now.getTime()/1000);
    articleSchema.findOne({_id:id}).then(data => {
        articleSchema.update({_id:id}, {category_id, content, cover_image, desc, tag_ids, title,updateTime:timeStr}).then(u => {
            responseClient(res,200,0,'更新成功!')
        }).catch(err => {
            responseClient(res)
        })
    }).catch(err => {
        responseClient(res)
    })
})

// 获取文章详情
 router.get('/getArticleInfo/:id', (req,res) => {
    let { id } = req.params;
    articleSchema.find({_id:id}).then(resp => {
        responseClient(res,200,0,'查询成功!',resp)
    }).catch(err => {
        responseClient(res)
    })
 })
/***文章管理 end */

router.get('/getRandNum', (req, res) => {
    let num = Math.random().toFixed(2)*1000+600;
    let result = {};
    result.num = num;
    responseClient(res, 200, 0, result);
})
module.exports = router;