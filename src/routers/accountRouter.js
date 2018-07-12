// 导入express
const express=require('express')
const path=require('path')

//创建路由对象
const accountRouter=express.Router()
const accountCtrl=require(path.join(__dirname,"../controllers/accountControl.js"))
//当浏览器发送了 http://127.0.0.1:3000/account/login 
//交给对应的控制器 accountCTRL 的 getLoginPage 方法处理
accountRouter.get('/login',accountCtrl.getLoginPage)

// 获取图片验证码
accountRouter.get('/vcode',accountCtrl.getImageVcode)
// 导出路由模块（路由中间件）
module.exports=accountRouter