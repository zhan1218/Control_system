const path=require('path')
// 引入图片验证码模板 npm--captchapng
const captchapng = require('captchapng');
const MongoClient = require('mongodb').MongoClient;
// Connection URL
const url = 'mongodb://localhost:27017';
// Database Name
const dbName = 'myData';


// 暴露了一个获取登录页面的方法，给路由调用
exports.getLoginPage=(req,res)=>{
    res.sendFile(path.join(__dirname,"../views/login.html"))
};

// 暴露出去获取图片验证码的方法
exports.getImageVcode=(req,res)=>{
    //1.利用一个第三方的包生成 一张带数字的图片
    const random=parseInt(Math.random()*9000+1000)

    // 需要把生成的验证码存起来，如何实现？？（利用session存储数据）
    req.session.vcode=random
    
    var p = new captchapng(80,30,random); 
        // width,height,numeric captcha
        p.color(0, 0, 0, 0);  
        // First color: background (red, green, blue, alpha)
        p.color(80, 80, 80, 255); 
        // Second color: paint (red, green, blue, alpha)
 
        var img = p.getBase64();
        var imgbase64 = new Buffer(img,'base64');
        res.writeHead(200, {
            'Content-Type': 'image/png'
        });
        // 返回并告知是一张图片
        res.end(imgbase64);
}

// 暴露出去获取注册页面的方法
exports.getRegisterPage=(req,res)=>{
    res.sendFile(path.join(__dirname,"../views/register.html"))
}

// 暴露注册请求的方法
exports.register=(req,res)=>{
  // status : 0 代表成功； 1 用户名存在； 2 注册失败
  const result={status:0,message:"注册成功!"}
  // 1.获取传递过来的username, password
  //es6的解构赋值 http://es6.ruanyifeng.com/  可直接获取对应的属性值
  const{username}=req.body

  // 2.判断用户名是否存在，如存在就响应给客户；不存在就先插入到数据库，然后再响应注册成功
  // node连接到mongodb服务端
  MongoClient.connect(url, {useNewUrlParser: true},function(err, client) {
      const db=client.db(dbName);

      // 获取数据库里面的集合进行操作
      const collection=db.collection('accountInfo');
      //先根据用户名，查询该用户是否存在
      collection.findOne({username},(err,doc)=>{
          // 存在
          if(doc !=null){
            result.status = 1
            result.message = "用户名已经存在!"
            client.close();
            res.json(result)
          }else{
              // 不存在--添加
              // req.body = {username:'admin',password:'12345'}
              collection.insertOne(req.body,(err,result1)=>{
                 // 判断插入结果是否失败，如果失败就是null
                 if(result1==null){
                    result.status = 2
                    result.message = "注册失败!"
                 }
                 client.close();
                 res.json(result)
              })

          }
      })
  })

}


/**
 * 暴露出一个方法，处理具体的登录请求
 * status : 0 成功
 *          1 验证码错误
 *          2 用户名或是密码错误
 */
exports.login=(req,res)=>{
    const result={status:0,message:'登录成功'}
    // 1.获取到请求体中的内容
    const {username,password,vcode}=req.body
    // 2.验证验证码（如果获取到的验证码和session存储中的验证码相同，则验证码正确）
    if(vcode !=req.session.vcode){
        result.status=1
        result.message="验证码错误"
        res.json(result)
        return
    }
    // 3.验证用户名和密码
      //2.1 node连接到mongodb服务端
  MongoClient.connect(url, {useNewUrlParser: true},function(err, client) {
    //   const db=client.db(dbname);
    const db = client.db(dbName);
      // 获取mondodb数据库中的 集合进行操作
      const collection=db.collection('accountInfo');
      collection.findOne({username,password},(err,doc)=>{
          if(doc == null){
              // 如果返回的是空值null，说明数据库中没有该数据，没查寻到
              result.status=2
              result.message="用户名或密码错误！"
          }
          client.close()
          res.json(result)
      })
  })


}