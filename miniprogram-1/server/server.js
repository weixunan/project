/*第二版*/
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const mysql = require('mysql')
const IPAddress = '172.29.24.161'
const dbUsername = 'root'
const dbPassword = 'mysql'
const dbName = 'mydb'
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
//这上面一段固定的



//处理get请求。这里是一个 get 请求的方法演示，作用是查询 user_info 表中的所有数据并返回。
/*app.get('/getUser',(req,res)=>{ //这里的是 get 方法 getUser，对应了刚才的页面发来的请求。就会执行这个方法。
  //参数传入是在 req.body 对象里面。比如上面的语句是获取传入的 openid 变量，并且我们新定义一个叫 openid 的变量存储传入的 openid 变量
  var connection=mysql.createConnection({
    host:IPAddress,
    port: 3306,		//端口号，mysql 固定3306
    user:UserName,
    password:PWD,
    database:DBName
  })//配置连接的属性
  connection.connect();//尝试连接
  connection.query("select * from user_info",function(error,results,fields){//执行查找语句
    if(error) console.log(error);//执行失败的话
    res.json(results)
    console.log(results)
    
  })
  connection.end();//断开连接
  
});*/

// 处理登录请求，验证数据库中是否有该用户
app.post('/login', (req, res)=>{
  // 解析请求体中的用户名和密码，req是前端传来的数据，res是后端返回的数据
  console.log("username->"+req.body.username);
  console.log("password->"+req.body.password);
  var username = req.body.username;
  var password = req.body.password;
  // 连接数据库
  var connection=mysql.createConnection({
    host:IPAddress,
    port: 3306,	
    user:dbUsername,
    password:dbPassword,
    database:dbName
  });
  connection.connect();
  // 在数据库中查找用户名和密码同时对应的用户
  /*connection.query("select * from user_info where username="+username, (error, results, fields) => {*/
  connection.query("select * from user_info where username = ? and password = ?", [username, password], (error, results) =>{ 
    //connection.end();
    // 要将输出对象转换为字符串表示
    console.log("results->"+JSON.stringify(results));
    if (results.length > 0) {
      // 用户存在，返回成功响应
      //console.log(results);
      return res.json({success: true, status: 1});
    } else {
      // 用户不存在
      console.log("error->用户不存在");
      return res.json({success: false, status: 0});
    }
  });
  connection.end();

});

/*
// 处理查找请求，根据货物名字或编号返回对应的货物信息
app.post('/search', (req, res)=>{
  // 解析请求体中的货物名字和编号
  console.log("gname->"+req.body.username);
  console.log("gno->"+req.body.password);
  var gname = req.body.username;
  var gno = req.body.password;
  // 连接数据库配置
  var connection=mysql.createConnection({
    host:IPAddress,
    port: 3306,	
    user:dbUsername,
    password:dbPassword,
    database:dbName
  });
  connection.connect(); // 连接
  // 在数据库中查找货物名字和编号有一个对应的用户
    connection.query("select * from goods_info where gname = ? or gno = ?", [gname, gno], (error, results) =>{ 
    //connection.end();
    console.log("results->"+JSON.stringify(results));
    if (results.length > 0) {
      // 对应货物存在，返回成功响应success和货物信息
      //console.log(results);
      // 将返回的信息包装在一个对象中
      const responseData = {success: true, goodsInfo: results};
      // 设置响应头，指定返回的数据类型为JSON
      res.setHeader('Content-Type', 'application/json');
      // 发送响应给前端
      //return res.json(responseData);
      //res.send(JSON.stringify(responseData));
    } else {
      // 对应货物不存在
      console.log("error->查询的货物不存在");
      return res.json({success: false});
    }
  });
  connection.end();

});
*/

// 监听端口，会输出监听到的信息，console.log 在这输出
app.listen(3003,()=>{
  console.log('server running at http://'+IPAddress+':3003')
});

