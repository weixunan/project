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
    // 要返回给前端的用户信息
    const userData = [results[0]['eno'], results[0]['ename'], results[0]['elevel']];
    console.log("userData->" + userData);
    if (results.length > 0) {
      // 用户存在，返回成功响应
      //console.log(results);
      return res.json({success: true, status: 1, userData: userData});
    } else {
      // 用户不存在
      console.log("error->用户不存在");
      return res.json({success: false, status: 0});
    }
  });
  connection.end();

});







// 处理入库请求，接收前端发来的入库货物信息，按顺序完成以下3个模块的操作，与3个数据表进行交互。
// 【子模块1】将货物信息保存到goods_info表中，根据货物是否已经存在分为两种情况：（已完成）
// 1. 编号为gno的货物已经存在，则通过update进行累加，更新库存数量；（已完成）
// 2. 货物在仓库中不存在，则将新的货物信息insert到数据库中。（已完成）
// 【子模块2】将订单信息保存到出入库订单表inout_info中（已完成）
// 【子模块3】更新仓库对应日期的每日数据，与每日数据汇总表day_info进行交互，分为两种情况：（已完成）
// 1. select查询到日期date已经有入库记录，只需update累加今日入库数量、入库采购金额、总库存数snum（已完成）
// 2. 日期date还没有入库记录，将入库信息insert到表中，并update累加总库存数snum（已完成）
// 未完成部分: 1.图片还没进行处理；
app.post('/input', (req, res)=>{
  // 解析请求体中的用户名和密码，req是前端传来的数据，res是后端返回的数据
  // 前端传来的req包含3个数据:
  // 1. req.body.json是入库表单填写的数据封装成的JSON对象，包括gno, gname, gtype, gnum, gunit, sname, gpricein, date
  // 2. req.body.gpicture是图片的url路径
  // 3. req.body.ono是订单号
  // 后端返回给前端的res包含一个数据:
  // 1. success表示入库操作是否成功，true代表成功，false代表失败

  // 先解析req中的数据，适当用console.log打印调试，确保跟前端传来的数据一致
  const json = req.body.json;
  console.log("前端发来的入库form表单json->" + JSON.stringify(json));
  const gpicture = req.body.gpicture;
  console.log("前端发来的入库货物图片gpicture->" + gpicture);
  const ono = req.body.ono;
  console.log("前端发来的入库订单号ono->" + ono);
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

  // 【子模块1 begin】与货物数据表goods_info的交互
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
          // return res.json({success: true,});
        }
      });
      // 更新control_info表的内容
      updateQuery = 'update control_info set gsnum = ? where gno = ?';
      updateValues = [newsum, json['gno']];
      connection.query(updateQuery, updateValues, (error, results) =>{
        if (error) {
          console.log("error->更新control_info的gsnum时出错");
          return res.json({success: false,});
        } else {
          console.log("success->已更新control_info的gsnum");
          // return res.json({success: true,});
        }
      });
    } else {
    // 2. 数据库中不存在编号为gno的货物，执行insert语句
      var insertQuery = 'insert into goods_info (gno, gname, gtype, gsnum, gunit, sname, gpricein, date, gpicture) values (?, ?, ?, ?, ?, ?, ?, ?, ?)';  
      var insertValues = [json['gno'], json['gname'], json['gtype'], json['gnum'], json['gunit'], json['sname'], json['gpricein'], json['date'], gpicture];  
      console.log("insertValues->" + insertValues);
      // 执行SQL语句，results是执行结果，error是出错标志(出错为true，成功为false)
      connection.query(insertQuery, insertValues, (error, results) =>{ 
        // 顺便打印一下输出结果
        console.log("insertResults->" + JSON.stringify(results));
        // error为false说明SQL语句执行成功
        if (!error) {
          // 插入成功，不返回，进行后续操作
          console.log("success->插入成功");
          // return res.json({success: true,});
        } else {
          // 插入失败，打印错误提示，并返回success为false
          console.log("error->插入失败");
          console.log(error);
          return res.json({success: false,});
        }
      });
      // 插入到control_info表中，执行insert语句
      var insertQuery = 'insert into control_info (gno, gname, gsnum, maxnum, minnum, recnum) values (?, ?, ?, ?, ?, ?)';  
      var insertValues = [json['gno'], json['gname'], json['gnum'], 999999, 0, json['gnum']];  
      console.log("insertValues->" + insertValues);
      // 执行SQL语句，results是执行结果，error是出错标志(出错为true，成功为false)
      connection.query(insertQuery, insertValues, (error, results) =>{ 
        // 顺便打印一下输出结果
        console.log("insertResults->" + JSON.stringify(results));
        // error为false说明SQL语句执行成功
        if (!error) {
          // 插入成功，不返回，进行后续操作
          console.log("success->插入control_info成功");
          // return res.json({success: true,});
        } else {
          // 插入失败，打印错误提示，并返回success为false
          console.log("error->插入control_info失败");
          console.log(error);
          return res.json({success: false,});
        }
      });      
    }
    // 【子模块1 end】

    // 【子模块2 begin】与出入库订单表inout_info的交互
    // 将入库订单的信息insert到数据库的订单表inout_info中
    var insertQuery2 = 'insert into inout_info (otype, ono, gno, gnum, sname, date, eno, gpicture) values (?, ?, ?, ?, ?, ?, ?, ?)';  
    var insertValues2 = [1, ono, json['gno'], json['gnum'], json['sname'], json['date'], json['eno'], gpicture];  
    console.log("insertValues2->" + insertValues2);
    connection.query(insertQuery2, insertValues2, (error, results) =>{ 
      console.log("insertResults2->" + JSON.stringify(results));
      // error为false说明SQL语句执行成功
      if (!error) {
        // 插入成功，不返回，进行下一步操作
        console.log("success->插入inout_info成功");
        // return res.json({success: true,});
      } else {
        // 插入失败，打印错误提示，并返回success为false
        console.log("error->插入inout_info失败");
        return res.json({success: false,});
      }
    });
    // 【子模块2 end】

    // 【子模块3 begin】与仓库每日数据汇总表day_info的交互
    // 更新day_info数据表，分为两种情况：
    // 1. select查询到日期date已经有入库记录，只需update累加今日入库din、入库采购金额、总库存数snum
    // 2. 日期date还没有入库记录，将入库信息insert到表中，并update累加总库存数snum
    // select查询今日是否已有入库记录
    var selectQuery = 'select * from day_info where date = ?';
    var selectValues = [json['date']];
    connection.query(selectQuery, selectValues, (error, results) =>{
      if (error) {
        console.log("error->day_info匹配date时出错");
        return res.json({success: false,});
      }
      // 查询成功，则根据查询结果分为两种情况：
      // 1. 日期date已有入库的记录，执行update语句，更新其数量和金额即可
      if (results.length > 0) {
        console.log("selectResults[0]->" + JSON.stringify(results[0]));
        // 新的今日入库数量
        var newdin = parseInt(results[0]['din']) + parseInt(json['gnum']);
        // 新的今日入库金额 = 本次入库数量 * 单价 + 旧的入库金额
        var newcost = parseInt(json['gnum']) * parseInt(json['gpricein']) + parseInt(results[0]['cost']);
        // 新的总库存数
        var newsnum = parseInt(results[0]['snum']) + parseInt(json['gnum']);
        // 执行update语句
        var updateQuery = 'update day_info set din = ?, cost = ?, snum = ? where date = ?';
        var updateValues = [newdin, newcost, newsnum, json['date']];
        console.log("updateValues->" + updateValues);
        connection.query(updateQuery, updateValues, (error, results) =>{
          if (error) {
            console.log("error->更新day_info时出错");
            return res.json({success: false,});
          } else {
            // 返回成功响应，success为true
            console.log("success->已更新day_info");
            return res.json({success: true,});
          }
        });
      } else {
      // 2. day_info表中不存在日期date的入库记录，执行insert语句
        // 新的今日入库金额 = 本次入库数量 * 单价
        var newcost = parseInt(json['gnum']) * parseInt(json['gpricein']);
        var insertQuery = 'insert into day_info (date, din, snum, cost) values (?, ?, ?, ?)';  
        var insertValues = [json['date'], json['gnum'], json['gnum'], newcost];  
        console.log("insertValues->" + insertValues);
        connection.query(insertQuery, insertValues, (error, results) =>{ 
          console.log("insertResults->" + JSON.stringify(results));
          if (!error) {
            // 插入成功，返回成功响应，只返回一个数据success，值为true
            console.log("success->插入day_info成功");
            return res.json({success: true,});
          } else {
            // 插入失败，打印错误提示，并返回success为false
            console.log("error->插入day_info失败");
            return res.json({success: false,});
          }
        });
      }    
    });
    // 【子模块3 end】

  // 关闭数据库连接(!!!一个函数中执行多个SQL语句时把下面这句代码注释掉，不要关闭连接，不然会有莫名其妙的错误，暂时不知道为什么出错)
  //connection.end();
  });
});


// 处理出库请求，接收前端发来的出库货物信息，按顺序完成以下3个模块的操作，与3个数据表进行交互。
// 【子模块1】根据货物编号更新goods_info表中对应货物出库后剩余的数量，根据货物是否存在分为两种情况：
// 1. 编号为gno的货物存在，则通过update更新库存数量（可考虑一下数量是否足够出库）；（半成品）
// 2. 货物在仓库中不存在，出库失败。(已完成)
// 【子模块2】将订单信息保存到出入库订单表inout_info中（实现方式与入库操作一样）（已完成）
// 【子模块3】更新仓库对应日期的每日数据，与每日数据汇总表day_info进行交互，分为两种情况：
// 1. select查询到日期date已经有出库记录，只需update累加今日出库数量、出库销售金额（已完成）
// 2. 日期date还没有出库记录，将出库信息insert到表中（已完成）
// 【未完成部分：子模块1中的update只考虑了货物是否存在，还没有考虑数量是否足够出库】
app.post('/output', (req, res)=>{
  // 解析req中的数据
  const json = req.body.json;
  console.log("前端发来的出库form表单json->" + JSON.stringify(json));
  const gpicture = req.body.gpicture;
  console.log("前端发来的出库货物图片gpicture->" + gpicture);
  const ono = req.body.ono;
  console.log("前端发来的出库订单号ono->" + ono);
  // 连接数据库
  var connection=mysql.createConnection({
    host:IPAddress,
    port: 3306,	
    user:dbUsername,
    password:dbPassword,
    database:dbName
  });
  connection.connect();

  // 是否进行下一步的标志未
  var next = false;

  // 【子模块1 begin】
  // select查看货物在goods_info中是否存在
  var selectQuery = 'select * from goods_info where gno = ?';
  var selectValues = [json['gno']];
  connection.query(selectQuery, selectValues, (error, results) =>{
    if (error) {
      console.log("error->出库goods_info匹配gno时出错");
      return res.json({success: false,});
    }
    // 1. 编号为gno的货物存在，执行update语句，更新其在goods_info的数量即可
    if (results.length > 0) {
      console.log("selectResults[0]->" + JSON.stringify(results[0]));
      // 新的数量
      var newgsnum = parseInt(results[0]['gsnum']) - parseInt(json['gnum']);
      // 更新最近操作时间
      var newdate = json['date'];
      // 执行update语句
      var updateQuery = 'update goods_info set gsnum = ?, date = ? where gno = ?';
      var updateValues = [newgsnum, newdate, json['gno']];
      console.log("updateValues->" + updateValues);
      connection.query(updateQuery, updateValues, (error, results) =>{
        if (error) {
          console.log("error->更新goods_info时出错");
          return res.json({success: false,});
        } else {
          // 返回成功响应，success为true
          console.log("success->已更新goods_info");
          // 【更新control_info表】
          var updateQuery = 'update control_info set gsnum = ? where gno = ?';
          var updateValues = [newgsnum, json['gno']]; 
          console.log("updateValues->" + updateValues);         
          connection.query(updateQuery, updateValues, (error, results) =>{
            if (error) {
              console.log("error->更新control_info时出错");
              return res.json({success: false,});              
            } else {
              console.log("success->已更新control_info");
              // 【子模块2 begin】与出入库订单表inout_info的交互
              // 将出库订单的信息insert到数据库的订单表inout_info中
              var insertQuery2 = 'insert into inout_info (otype, ono, gno, gnum, cname, date, eno, gpicture) values (?, ?, ?, ?, ?, ?, ?, ?)';  
              var insertValues2 = [0, ono, json['gno'], json['gnum'], json['cname'], json['date'], json['eno'], gpicture];  
              console.log("insertValues2->" + insertValues2);
              connection.query(insertQuery2, insertValues2, (error, results) =>{ 
                console.log("insertResults2->" + JSON.stringify(results));
                if (!error) {
                  // 插入成功，不返回，进行下一步操作
                  console.log("success->插入inout_info成功");

                  // 【子模块3 begin】与仓库每日数据汇总表day_info的交互
                  // 更新day_info数据表，分为两种情况：
                  // 1. select查询到日期date已经有出入库记录，只需update累加今日出库dout、出库金额、总库存数snum
                  // 2. 日期date还没有出入库记录，将出库信息insert到表中，并update累加总库存数snum
                  // select查询今日是否已有入库记录
                  var selectQuery = 'select * from day_info where date = ?';
                  var selectValues = [json['date']];
                  connection.query(selectQuery, selectValues, (error, results) =>{
                    if (error) {
                      console.log("error->day_info匹配date时出错");
                      return res.json({success: false,});
                    }
                    // 查询成功，则根据查询结果分为两种情况：
                    // 1. 日期date已有出入库的记录，执行update语句，更新其数量和金额即可
                    if (results.length > 0) {
                      console.log("selectResults[0]->" + JSON.stringify(results[0]));
                      // 新的今日出库数量
                      var newdout = parseInt(results[0]['dout']) + parseInt(json['gnum']);
                      // 新的今日出库金额 = 本次出库数量 * 出货单价 + 旧的出库金额
                      var newincome = parseInt(json['gnum']) * parseInt(json['gpriceout']) + parseInt(results[0]['income']);
                      // 新的总库存数
                      var newsnum = parseInt(results[0]['snum']) - parseInt(json['gnum']);
                      // 执行update语句
                      var updateQuery = 'update day_info set dout = ?, income = ?, snum = ? where date = ?';
                      var updateValues = [newdout, newincome, newsnum, json['date']];
                      console.log("updateValues->" + updateValues);
                      connection.query(updateQuery, updateValues, (error, results) =>{
                        if (error) {
                          console.log("error->更新day_info时出错");
                          return res.json({success: false,});
                        } else {
                          // 返回成功响应，success为true
                          console.log("success->已更新day_info");
                          next = true;
                          return res.json({success: true,});
                        }
                      });
                    } else {
                    // 2. day_info表中不存在日期date的出入库记录，执行insert语句
                      // 新的今日出库金额 = 本次出库数量 * 出货单价
                      var newincome = parseInt(json['gnum']) * parseInt(json['gpriceout']);
                      var insertQuery = 'insert into day_info (date, dout, snum, income) values (?, ?, ?, ?)';  
                      var insertValues = [json['date'], json['gnum'], json['gnum'], newincome];  
                      console.log("insertValues->" + insertValues);
                      connection.query(insertQuery, insertValues, (error, results) =>{ 
                        console.log("insertResults->" + JSON.stringify(results));
                        if (!error) {
                          // 插入成功，返回成功响应，只返回一个数据success，值为true
                          console.log("success->插入day_info成功");
                          return res.json({success: true,});
                        } else {
                          // 插入失败，打印错误提示，并返回success为false
                          console.log("error->插入day_info失败");
                          return res.json({success: false,});
                        }
                      });
                    }    
                  });
                // 【子模块3 end】
                } else {
                // 插入失败，打印错误提示，并返回success为false
                console.log("error->插入inout_info失败");
                return res.json({success: false,});
                }
              });
            // 【子模块2 end】
            }
          });    
        }
      });
    } else {
    // 2. goods_info表中不存在该货物，出库失败
      console.log("error->goods_info中不存在该货物gno，出库失败");
      return res.json({success: false,});
    }    
  });
  // 【子模块1 end】
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
//处理获取当日库存状况的请求
app.post('/basicData', (req, res) => {
  //console.log(2);
  //数据库连接
  var connection = mysql.createConnection({
    host: IPAddress,
    port: 3306,
    user: dbUsername,
    password: dbPassword,
    database: dbName
  });
  connection.connect();

  request = req.body.request;

  if (request == "getBasicMessage") {
    //使用日期相关的函数，获取当日日期，格式为YYYY-MM-DD，结果放在变量formattedDate里
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    console.log(formattedDate);

    //编辑数据库命令，在数据表中找出日期和当日相同的条目
    var sql = "select * from day_info where date = ?";
    //发送给数据库执行命令，错误信息存储在error中，可以通过console.log输出，得到的结果存储在result中
    connection.query(sql, formattedDate, (error, results) => {
      // error为false说明SQL语句执行成功
      if (!error) {
        // 插入成功，返回成功响应，返回数据success为true，和result
        console.log("success->成功获取din、dout");

        sql = "select sum(din)-sum(dout) as snum from day_info";
        connection.query(sql, formattedDate, (error, result_snum) => {
          if (!error) {
            console.log("success->成功获取snum");
            //打包成json对象返回
            return res.json({
              success: true,
              day_info: results,
              snum: result_snum,
            });
          } else {
            // 插入失败，打印错误提示，并返回success为false
            console.log("error->获取失败" + error);
            return res.json({
              success: false,
            });
          }
        })
      } else {
        // 插入失败，打印错误提示，并返回success为false
        console.log("error->获取失败" + error);
        return res.json({
          success: false,
        });
      }
    });
  } else if (request == "getBasicMessageByTime") {
    beginDate = req.body.beginDate;
    endDate = req.body.endDate;
    var sql = "SELECT " +
      "SUM(din) AS total_din, " +
      "SUM(dout) AS total_dout, " +
      "SUM(income) AS total_income, " +
      "SUM(cost) AS total_cost " +
      "FROM " +
      "day_info " +
      "WHERE " +
      "date BETWEEN ? AND ?";
    connection.query(sql, [beginDate, endDate], (error, results) => {
      if (!error) {
        console.log("success->成功获取");
        return res.json({
          success: true,
          day_info: results
        });
      } else {
        console.log("error->获取失败" + error);
        return res.json({
          success: false,
        });
      }
    });
  }
});

//取得预警信息
app.post('/getWarningMessages',(req,res)=>{
  var connection=mysql.createConnection({
    host:IPAddress,
    port: 3306,	
    user:dbUsername,
    password:dbPassword,
    database:dbName
  });
  connection.connect();
  // 解析req
  var type = req.body.request;
  console.log("type->" + type);
  /*connection.query('select * from warn_info',(error,results)=>{
    if(error){
      console.error('Error fetching warning messages2:', error);
      return res.status(500).json({error: 'Internal Server Error'});
    }else{
      return res.json(results);
    }
    //关闭连接
    
  })*/
  var sql = 'select * from control_info where gsnum < minnum';
  if (type === 'more') {
    sql = 'select * from control_info where gsnum > maxnum';
  }
  connection.query(sql,(error,results)=>{
    if(error){
      console.error('Error fetching warning messages2:', error);
      return res.status(500).json({error: 'Internal Server Error'});
    }else{
      return res.json(results);
    }
    //关闭连接
    
  })
  connection.end();
});

//首页获取预警个数
app.post('/getWarningNumber', (req,res)=>{
  var connection=mysql.createConnection({
    host:IPAddress,
    port: 3306,	
    user:dbUsername,
    password:dbPassword,
    database:dbName
  });
  connection.connect();
  // sql = "select count(wstatus) as warn_nums from warn_info where wstatus = 0";
  sql = "select count(*) as warn_nums from control_info where gsnum < minnum or gsnum > maxnum";
  connection.query(sql, (error, results)=>{
    if(!error){
      return res.json({
        warn_nums: results,
        success: true,
      })
    }
    else {
      return res.json({
        success: false,
      })
    }
  })
});

//员工管理页面:获取员工信息
app.get('/getUserMessages',(req,res)=>{
  var connection=mysql.createConnection({
    host:IPAddress,
    port: 3306,	
    user:dbUsername,
    password:dbPassword,
    database:dbName
  });
  connection.connect();
  connection.query('select * from user_info',(error,results)=>{
    if(error){
      console.error('Error fetching warning messages:', error);
      res.status(500).json({error: 'Internal Server Error'});
    }else{
      res.json(results);
    }
  })
  connection.end();
  //关闭连接
});

//货物查询
app.get('/getInventoryMessages',(req,res)=>{
  var connection=mysql.createConnection({
    host:IPAddress,
    port: 3306,	
    user:dbUsername,
    password:dbPassword,
    database:dbName
  });
  connection.connect();
  connection.query('select * from goods_info',(error,results)=>{
    if(error){
      console.error('Error fetching warning messages:', error);
      res.status(500).json({error: 'Internal Server Error'});
    }else{
      res.json(results);
    }
    connection.end();
    //关闭连接
    
  })

});
//在库存查询页面中获得所有种类的货物
app.get('/getInventoryType',(req,res)=>{
  var connection=mysql.createConnection({
    host:IPAddress,
    port: 3306,	
    user:dbUsername,
    password:dbPassword,
    database:dbName
  });
  connection.connect();
  connection.query('select Distinct gtype from goods_info',(error,results)=>{
    if(error){
      console.error('Error fetching warning messages:', error);
      res.status(500).json({error: 'Internal Server Error'});
    }else{
      res.json(results);
    }
    connection.end();
    //关闭连接
    
  })

});

app.get('/getInventoryMessagesByType',(req,res)=>{
  var connection=mysql.createConnection({
    host:IPAddress,
    port: 3306,	
    user:dbUsername,
    password:dbPassword,
    database:dbName
  });
  var type=req.query.type;
  console.log("Count type:?",type);
  connection.connect();
  connection.query("select * from goods_info where gtype=?",[type],(error,results)=>{
    if(error){
      console.error('Error fetching warning messages:', error);
      res.status(500).json({error: 'Internal Server Error'});
    }else{
      res.json(results);
    }
    connection.end();
    //关闭连接
    
  })

});

// 获取编号为eno的员工今日操作出入库的货物数量
// 前端req传来两个数据：1.员工编号eno  2.标志码（1请求得到入库数量0请求得到出库数量）
// 后端res返回两个数据：1。操作成功与否success  2.出库或入库的数量edin
app.post('/personal', (req, res)=>{
  // 解析请求体中的员工编号eno
  console.log("eno->"+req.body.eno);
  var eno = req.body.eno;
  var otype = req.body.otype;
  // 连接数据库
  var connection=mysql.createConnection({
    host:IPAddress,
    port: 3306,	
    user:dbUsername,
    password:dbPassword,
    database:dbName
  });
  connection.connect();
  // 获取今天日期YYYY-MM-DD
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;
  console.log("today->" + formattedDate);
  // 在数据库inout_info表中根据日期和员工编号，找到相关订单，累加出入库数量
  var selectQuery = 'select sum(gnum) as edin from inout_info where date = ? and eno = ? and otype = ?';
  var selectValues = [formattedDate, eno, otype];
  connection.query(selectQuery, selectValues, (error, results) =>{ 
    //connection.end();
    // 要将输出对象转换为字符串表示
    console.log("results->"+JSON.stringify(results));
    // 要返回给前端的用户信息
    var edin = results[0]['edin'];
    if (!edin) {
      edin = 0;
    }
    console.log("edin->" + edin);
    if (results.length > 0) {
      // 返回成功响应
      return res.json({success: true, edin: edin});
    } else {
      // 失败
      console.log("error->/personal查找失败");
      return res.json({success: false});
    }
  });
  connection.end();
});
app.get('/getRecords',(req,res)=>{
  var connection=mysql.createConnection({
    host:IPAddress,
    port: 3306,	
    user:dbUsername,
    password:dbPassword,
    database:dbName
  });
  var beginDate=req.query.vbeginDate;
  var endDate=req.query.vendDate;
  var currentPage=req.query.vcurrentPage;
  console.log(beginDate);
  console.log(endDate);
  console.log(currentPage);
  connection.connect();
  connection.query("select a.*,b.gname,b.gno,b.gsnum,b.gunit from inout_info a,goods_info b where a.gno=b.gno and a.otype=? and a.date>=? and a.date<=?",[currentPage,beginDate,endDate],(error,results)=>{
    if(error){
      console.error('Error fetching warning messages:', error);
      res.status(500).json({error: 'Internal Server Error'});
    }else{
      res.json(results);
    }
    connection.end();
    //关闭连接
    
  })

});

// 添加新用户
app.post('/addUser', (req, res)=>{
  const json = req.body.json;
  // 连接数据库（不需要修改，我们的数据库目前运行在172.29.24.161）
  var connection=mysql.createConnection({
    host:IPAddress,
    port: 3306,	
    user:dbUsername,
    password:dbPassword,
    database:dbName
  });
  connection.connect();
  // 先检查该员工编号是否已经存在
  var sql = 'select * from user_info where eno = ?';
  var values = [json['eno']];
  connection.query(sql, values, (error, results) =>{
    if (error) {
      console.log("error->添加用户匹配eno时出错");
      return res.json({success: false,});
    } 
    // 员工编号已存在，添加失败
    if (results.length > 0) {
      console.log("error->添加用户eno已存在，无法添加");
      return res.json({success: false,});
    } else {
    // 员工编号不存在，则可以添加
      sql = 'insert into user_info (username, password, eno, ename, elevel) values (?, ?, ?, ?, ?)';
      values = [json['username'], json['password'], json['eno'], json['ename'], json['elevel']];
      connection.query(sql, values, (error, results) =>{
        if (!error) {
          console.log("success->添加用户成功");
          return res.json({success: true,});
        } else {
          console.log("error->添加用户插入失败");
          return res.json({success: false,});
        }
      });
    }
  });
});


// 设置货物的基准信息（最大数量，最小数量，推荐数量）
app.post('/setBaseline', (req, res)=>{
  const json = req.body.json;
  // 连接数据库
  var connection=mysql.createConnection({
    host:IPAddress,
    port: 3306,	
    user:dbUsername,
    password:dbPassword,
    database:dbName
  });
  connection.connect();
  // 更新control_info表中的基准信息
  var sql = 'update control_info set maxnum = ?, minnum = ?, recnum = ? where gno = ?';
  var values = [json['maxnum'], json['minnum'], json['recnum'], json['gno']];
  connection.query(sql, values, (error, results) =>{
    if (error) {
      console.log("error->更新基准信息时出错");
      return res.json({success: false,});
    } else {
      console.log("error->更新基准信息成功");
      return res.json({success: true,});
    }
  });
});



// 监听端口，会输出监听到的信息，console.log 在这输出
app.listen(3003,()=>{
  console.log('server running at http://'+IPAddress+':3003')
});

