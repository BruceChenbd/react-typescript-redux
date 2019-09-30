var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const  User  = require('../model/user');
const  {MD5_KEY,responseClient,md5}  = require('../utils/utils')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/***
 * 用户登陆接口
 */
router.post('/login', (req,res) => {
  let {username,password} = req.body;
  User.findOne({
    username,
    password: md5(password + MD5_KEY)
  }).then(userInfo => {
    if(userInfo) {
      // login success
      let data = {};
      data.username = userInfo.username;
      data.userType = userInfo.type;
      data.userId = userInfo._id;
      data.avatar_image = userInfo.avatar_image;
      data.profile = userInfo.profile;
      data.website = userInfo.website;
      data.nick_name = userInfo.nickname;
      data.email = userInfo.email;
      // login success and set session
      req.session.userInfo = data;

      // set jsonwebtoken
      // data 要生成token的主题信息
      let secretOrPrivateKey="bgg"+userInfo._id; // 这是加密的key（密钥）
      let token = jwt.sign(data, secretOrPrivateKey, {
          expiresIn: 60*60*1  // 1小时过期
      });
      console.log(token,'token')
      data.token = token;
      responseClient(res, 200, 0, '登录成功!', data)
      return;
    }
    responseClient(res, 200, 1, '用户名或密码错误!');
  }).catch(err => {
    responseClient(res);
  })
})

/***
 * 用户注册接口
 */

router.post('/regist', (req,res) => {
  let {username, password,passwordRe } = req.body;
  User.findOne({username}).
  then(v => {
    if(v) {
      responseClient(res,200,1,'此账号已经注册，请前往登录');
      return;
    }
    // 保存
    let user = new User({
      username,
      password: md5(password + MD5_KEY),
      type: 'admin'
    });
    user.save().then(data => {
      User.findOne({username}).then(user => {
        let data = {};
        data.username = user.username;
        data.userType = user.type;
        data.userId = user._id;
        responseClient(res,200,0,'注册成功!',data);
        return;
      })
    })
  }).catch(err => {
    responseClient(res);
    return;
  })
})

/***
 * 用户验证
 */

router.get('/userInfo',function (req,res) {
  if(req.session.userInfo){
      responseClient(res,200,0,'',req.session.userInfo)
  }else{
      responseClient(res,200,1,'请重新登录',req.session.userInfo)
  }
});


router.post('/checkUser',(req,res)=>{
  let tokenAndUserId = req.headers['x-auth-token']; // 从Authorization中获取token
  let token = tokenAndUserId.split('&&')[1];
  let userId = tokenAndUserId.split('&&')[0];
 
  let secretOrPrivateKey="bgg"+ userId; // 这是加密的key（密钥）
  jwt.verify(token, secretOrPrivateKey, (err, decode)=> {
          if (err) {  //  时间失效的时候 || 伪造的token
              responseClient(res,200,2,'身份验证失败，请重新登录!')
          } else {
              responseClient(res,200,0,'token验证成功!')
          }
  })
});

router.get('/logout',function (req,res) {
  req.session.destroy();
  res.redirect('/');
});
module.exports = router;
