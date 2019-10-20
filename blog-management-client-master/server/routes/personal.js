var express = require('express');
var router = express.Router();
var fs = require('fs');
var formidable = require('formidable');
var sd = require('silly-datetime');
const  User  = require('../model/user');
const  classifySchema = require('../model/classify');
const  {MD5_KEY,responseClient,md5}  = require('../utils/utils')

// 个人中心 上传图片
router.post('/upload', (req,res) => {

    let AVATAR_UPLOAD_FOLDER = '/avatar';
    //创建上传表单
    var form = new formidable.IncomingForm();
    //设置编码格式
    form.encoding = 'utf-8';
    //设置上传目录
    form.uploadDir = './public' + AVATAR_UPLOAD_FOLDER;
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
             data: AVATAR_UPLOAD_FOLDER + '/' + avatarName,
             status: 0,
             message: "图片上传成功",
          }
       })
      }
    })
  })
})

// 更新用户信息
router.put('/updateInfo', (req,res) => {
  let { username, email, nickname, website,profile,avatar_image} = req.body;
  let tokenAndUserId = req.headers['x-auth-token']; // 从Authorization中获取token
  let token = tokenAndUserId.split('&&')[1];
  let userId = tokenAndUserId.split('&&')[0];

  User.findOne({
    _id:userId
  }).then(user => {
    if(user) {
      let updateUser = {
        email: email? email:'',
        nickname: nickname? nickname:'',
        website: website? website:'',
        profile: profile? profile:'',
        avatar_image: avatar_image? avatar_image:'',
      }
      User.update({_id:userId},updateUser).then(data => {
        User.findOne({nickname}).then(u => {
          let data = {};
          data.email = u.email;
          data.nickname = u.nickname;
          data.website = u.website;
          data.profile = u.profile;
          data.avatar_image = u.avatar_image;
          responseClient(res, 200, 0, '更新成功!', data)
        })
      })
    }
  }).catch(err => {
    responseClient(res)
  })
})

// 更新密码
router.put('/updatePsw', (req,res) => {
  let { username, old_password, new_password, re_password } = req.body;
  new_password = md5(new_password + MD5_KEY);
  User.findOne({
    username,
    password: md5(old_password + MD5_KEY)
  }).then(user => {
    if(user) {
      User.update({password: new_password}).then(u => {
        responseClient(res, 200 ,0, '密码修改成功!')
      }).catch(err => {
        responseClient(err)
      })
    }
  }).catch(err => {
    responseClient(err)
  })
})
module.exports = router;