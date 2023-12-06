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
  //connection.end();//断开连接
  
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



// 处理入库请求，接收前端发来的入库货物信息，根据货物是否已经存在分为两种情况：
// 1. 编号为gno的货物已经存在，则通过update进行累加，更新库存数量；（已完成）
// 2. 货物在仓库中不存在，则将新的货物信息insert到数据库中。（已完成）
// 未完成部分: 1.图片还没进行处理；2.订单号的自动生成还没写。
app.post('/input', (req, res)=>{
  // 解析请求体中的用户名和密码，req是前端传来的数据，res是后端返回的数据
  // 前端传来的req包含两个数据:
  // 1. res.body.json是入库表单填写的数据封装成的JSON对象，包括gno, gname, gtype, gnum, gunit, sname, gpricein, date
  // 2. res.body.gpicture是图片的url路径
  // 后端返回给前端的res包含一个数据:
  // 1. success表示入库操作是否成功，true代表成功，false代表失败

  // 先解析req中的数据，适当用console.log打印调试，确保跟前端传来的数据一致
  const json = req.body.json;
  console.log("前端发来的入库form表单json->" + JSON.stringify(json));
  const gpicture = req.body.gpicture;
  console.log("前端发来的入库货物图片gpicture->" + gpicture);
  // 连接数据库（不需要修改，我们的数据库目前运行在172.29.24.161）
  var connection=mysql.createConnection({
    host:IPAddress,
    port: 3306,	
    user:dbUsername,
    password:dbPassword,
    database:dbName
  });
  connection.connect();
  // 执行数据库插入语句，query是SQL语句，values是(?,?,?)对应要插入的数据
  // 注意一下values的值，由于传过来的json是JSON对象，不能直接用，可通过json['gno']取出其中‘gno’对应的值。
  //关于JSON对象可以自己去查询了解，当console.log打印出来的对象是undefined的时候，就要考虑一下是不是JSON对象的问题

  // 先根据货物编号gno查一下数据库中是否已经存在该货物:
  // 如果存在，就直接将本次入库操作的数量累加到已有的库存数量中即可；
  // 如果不存在，就需要执行插入语句，将本次新入库的货物的信息插入到表中。
  // SQL查询
  var query = 'select * from goods_info where gno = ?';
  var values = [json['gno']];
  // 执行SQL语句，results是执行结果，error是出错标志(出错为true，成功为false)
  connection.query(query, values, (error, results) =>{
    if (error) {
      // 查询失败，打印错误提示，并返回success为false
      console.log("error->匹配gno时出错");
      return res.json({success: false,});
    }
    // 查询成功，则根据查询结果分为两种情况：
    // 1. 数据库中已经存在编号为gno的货物，执行update语句，更新其数量即可
    if (results.length > 0) {
      // console.log("results[0]->" + JSON.stringify(results[0]));
      // console.log("gsnum->" + results[0]['gsnum']);
      // console.log("json.gsnum->" + json['gnum']);
      // 执行加法时要转为int类型，否则是字符串连接
      var newsum = parseInt(results[0]['gsnum']) + parseInt(json['gnum']);
      // 执行update语句
      var updateQuery = 'update goods_info set gsnum = ? where gno = ?';
      var updateValues = [newsum, json['gno']];
      // console.log(newsum);
      console.log("updateValues->" + updateValues);
      connection.query(updateQuery, updateValues, (error, results) =>{
        if (error) {
          console.log("error->更新gsnum时出错");
          return res.json({success: false,});
        } else {
          console.log("success->已更新gsnum");
          return res.json({success: true,});
        }
      });
    } else {
    // 2. 数据库中不存在编号为gno的货物，执行insert语句
      var insertQuery = 'insert into goods_info (gno, gname, gtype, gsnum, gunit, sname, gpricein, date) values (?, ?, ?, ?, ?, ?, ?, ?)';  
      var insertValues = [json['gno'], json['gname'], json['gtype'], json['gnum'], json['gunit'], json['sname'], json['gpricein'], json['date']];  
      console.log("insertValues->" + insertValues);
      // 执行SQL语句，results是执行结果，error是出错标志(出错为true，成功为false)
      connection.query(insertQuery, insertValues, (error, results) =>{ 
        // 顺便打印一下输出结果
        console.log("insertResults->" + JSON.stringify(results));
        // error为false说明SQL语句执行成功
        if (!error) {
          // 插入成功，返回成功响应，只返回一个数据success，值为true
          console.log("success->插入成功");
          return res.json({success: true,});
        } else {
          // 插入失败，打印错误提示，并返回success为false
          console.log("error->插入失败");
          return res.json({success: false,});
        }
      });
    }
  });
  // 关闭数据库连接(!!!一个函数中执行多个SQL语句时把下面这句代码注释掉，不要关闭连接，不然会有莫名其妙的错误，暂时不知道为什么出错)
  //connection.end();
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

