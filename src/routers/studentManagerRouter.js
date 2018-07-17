const express = require('express')
const path = require('path')

const studentManagerRouter = express.Router()

//导入控制器
const studentManagerCtrl = require(path.join(__dirname,"../controllers/studentManagerController.js"))

//处理请求
//获取学生列表页面
studentManagerRouter.get('/list',studentManagerCtrl.getStudentListPage)

// 获取新增页面
studentManagerRouter.get('/add',studentManagerCtrl.getAddStudentPage)

// 新增学生信息
studentManagerRouter.post('/add',studentManagerCtrl.addStudent)

// 获取学生修改页面  Get传值的一种方式：params（：属性名）
studentManagerRouter.get('/edit/:studentId',studentManagerCtrl.getEditStudentPage)

// 修改学生信息 post也可以使用params传值
studentManagerRouter.post('/edit/:studentId',studentManagerCtrl.editStudent)

// 删除学生信息
studentManagerRouter.get('/delete/:studentId',studentManagerCtrl.deleteStudent)

// 把路由模板暴露出去
module.exports = studentManagerRouter