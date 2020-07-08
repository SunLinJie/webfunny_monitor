var fs = require('fs');

var pathArray = ["./bin/domain.js", "./bin/messageQueue.js", "./bin/mysqlConfig.js", "./bin/purchaseCode.js", "./bin/saveDays.js", "./bin/useCusEmailSys.js", "./bin/webfunny.js"]
var fileArray = [
    `module.exports = {
        localServerDomain: 'localhost:8011', // 日志服务域名  书写形式：localhost:8011
        localAssetsDomain: 'localhost:8010', // 数据可视化服务域名 书写形式：localhost:8010
        localServerPort: '8011',               // 日志服务端口号
        localAssetsPort: '8010',               // 可视化系统端口号
    
        /**
         * 注意：不懂可以不用设置，【千万不要乱设置】
         * 
         * 1. 什么情况设置：如果同一个主域名下有多个项目，并且同一个UserId的用户，会访问这多个项目
         * 2. 设置结果：使用userId查询，可以将一个用户在多个项目上的行为串联起来。
         * 
         * 例如：www.baidu.com  主域名就是：baidu.com
         */
        mainDomain: ''                         // 公司主域名 
    }`,
    `module.exports = {
        messageQueue: false  // 是否开启消息队列，默认不开启
    }`,
    `module.exports = {
        ip: '',                 // mysql数据库所在云服务器的ip地址
        port: '',
        dataBaseName: '',       // 数据库名称（如：webfunny_db）
        userName: '',           // mysql的登录名
        password: ''            // mysql的登录密码
    }`,
    `module.exports = {
        purchaseCode: 'AAAABBBBCCCCDDDD',
    }`,
    `module.exports = {
        saveDays: '8',
    }`,
    `module.exports = {
        useCusEmailSys: false               // 是否使用自己的邮件系统
    }`,
    `#!/usr/bin/env node

    var app = require('../app');
    var debug = require('debug')('demo:server');
    var compression = require('compression')
    var { accountInfo } = require("../config/AccountConfig")
    
    
    var port = normalizePort(process.env.PORT || accountInfo.localServerPort);
    app.listen(port);
    
    function normalizePort(val) {
      var port = parseInt(val, 10);
    
      if (isNaN(port)) {
        // named pipe
        return val;
      }
    
      if (port >= 0) {
        // port number
        return port;
      }
    
      return false;
    }
    
    function onError(error) {
      if (error.syscall !== 'listen') {
        throw error;
      }
    
      var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;
    
      // handle specific listen errors with friendly messages
      switch (error.code) {
        case 'EACCES':
          console.error(bind + ' requires elevated privileges');
          process.exit(1);
          break;
        case 'EADDRINUSE':
          console.error(bind + ' is already in use');
          process.exit(1);
          break;
        default:
          throw error;
      }
    }
    
    function onListening() {
      var addr = server.address();
      var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
      debug('Listening on ' + bind);
    }
    
    // 启动静态文件服务器
    var connect = require("connect");
    var serveStatic = require("serve-static");
    var app = connect();
    app.use(compression())
    app.use(serveStatic("./views"));
    app.listen(accountInfo.localAssetsPort);
    
    `
]

pathArray.forEach((path, index) => {
    fs.readFile(path, "", (err) => {
        if (err) {
            console.log("× " + path + " 配置文件不存在，即将创建...")
            fs.writeFile(path, fileArray[index], (err) => {
                if (err) throw err;
                console.log("√ " + path + " 配置文件创建完成！");
            });
        } else {
            console.log("√ " + path + " 配置文件已存在！")
        }
    });
})
