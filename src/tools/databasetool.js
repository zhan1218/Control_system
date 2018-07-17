// 这个模块是专门操作数据库的模块，是承上启下（让控制器不直接和mongodb数据库联系，而是通过该模块）/ 暴露给控制器调用的方法是通用的
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId

exports.ObjectId = ObjectId

// Connection URL
const url = 'mongodb://localhost:27017';
 
// Database Name
const dbName = 'myData';

// 抽取出一个通用方法，来获取集合(在databasetool.js内部使用，不需要暴露) 更新和删除部分使用这个抽取的getCollection方法！
const getCollection=(collectionName,callback)=>{
    // 连接
    MongoClient.connect(url,{useNewUrlParser:true},function(err,client){
        const db=client.db(dbName);
        // 获取集合进行操作
        const collection=db.collection(collectionName);
        // 回调
        callback(client,collection)
    })
}

 /**
  * 暴露出去的一个通用的插入一条文档的方法，这个方法是给所有控制器用的
  * 
  * 参数1：要操作的集合名称
  * 参数2：要操作的数据
  * 参数3：回调函数，通过回调函数，把操作数据库的结果(成功或是失败)传递给调用它的控制器
  */
 exports.insertOne=(collectionName,params,callback)=>{
         //1.连接
    MongoClient.connect(url, {useNewUrlParser: true},function(err, client) {
        const db = client.db(dbName);
    
        //获取集合，进行操作
        const collection = db.collection(collectionName);

        //调用collection插入一个的方法
        collection.insertOne(params,(err,result)=>{
            // 拿到结果后关闭数据库
            client.close();

            //调用回调函数，把结果告知控制器
            callback(err,result)
        })
    })
 }


 /**
  * 暴露出去的一个通用的查询findOne一条文档的方法，这个方法是给所有控制器用的
  * 
  * 参数1：要操作的集合名称
  * 参数2：要操作的数据
  * 参数3：回调函数，通过回调函数，把操作数据库的结果(成功或是失败)传递给调用它的控制器
  */
 exports.findOne=(collectionName,params,callback)=>{
     //1.连接
     MongoClient.connect(url, {useNewUrlParser: true},function(err, client) {
        const db = client.db(dbName);
    
        //获取集合，进行操作
        const collection = db.collection(collectionName);

        //调用collection查询一个的方法
        collection.findOne(params,(err,doc)=>{
            // 拿到结果后关闭数据库
            client.close();

            //调用回调函数，把结果告知控制器
            callback(err,doc)
        })
    })
 }


  /**
  * 暴露出去的一个通用的查询findList多条文档的方法，这个方法是给所有控制器用的
  * 
  * 参数1：要操作的集合名称
  * 参数2：要操作的数据
  * 参数3：回调函数，通过回调函数，把操作数据库的结果(成功或是失败)传递给调用它的控制器
  */
 exports.findList=(collectionName,params,callback)=>{
     MongoClient.connect(url,{useNewUrlParser:true},function(err,client){
        const db = client.db(dbName);

        //获取集合，进行操作
        const collection = db.collection(collectionName);
     
          //查询多条数据
          collection.find(params).toArray((err,docs)=>{
            client.close()

            //通过回调，把结果传递给调用它的控制器
            callback(err,docs)
        })
     })
 }


   /**
  * 暴露出去的一个通用的更改updateOne一条文档的方法，这个方法是给所有控制器用的
  * 
  * 参数1：要操作的集合名称
  * 参数2：条件（上面已封装的方法）
  * 参数3：要更改成的值
  * 参数4：回调函数，通过回调函数，把操作数据库的结果(成功或是失败)传递给调用它的控制器
  */
 exports.updateOne=(collectionName,condition,params,callback)=>{
     // 获取要操作的集合
     getCollection(collectionName,(client,collection)=>{
         // 修改
         collection.updateOne(condition,{$set:params},(err,result)=>{
             // 关闭数据库
             client.close()
             // 调用回调函数，把结果告知控制器
             callback(err,result)
         })
     })
 }

 
  /**
  * 暴露出去的一个通用的删除一条文档的方法，这个方法是给所有控制器用的
  * 
  * 参数1：要操作的集合名称
  * 参数2：要操作的数据
  * 参数3：回调函数，通过回调函数，把操作数据库的结果(成功或是失败)传递给调用它的控制器
  */
 exports.deleteOne=(collectionName,params,callback)=>{
     // 1.获取要操作的集合
     getCollection(collectionName,(client,collection)=>{
         // 2.删除
           collection.deleteOne(params,(err,result)=>{
        // 拿到结果后关闭数据库
             client.close();
        //4.通过回调，将删除之后的结果，返回给调用它的控制器
            callback(err,result)
         })
     })
 }