let express = require('express');
let app = express();
let server = require('http').createServer(app);
let io = require('socket.io')(server);
let path = require('path');

app.use('/', (req, res, next) => {
  res.status(200).sendFile(path.resolve(__dirname, 'index.html'));
});

// 开启 socket.io
io.on('connection', (client) => {

  // 如果有新客户端进来，显示 ID
  console.log(`客户端 ID：${client.id}`);

  // 监听客户端的输入信息
  client.on('channel', (data) => {
    console.log(`客户端 ${client.id} 发送信息 ${data}`);
    io.emit('broadcast', data);
  });

  // 判断客户端是否关闭
  client.on('disconnect', () => {
    console.log(`客户端关闭：${client.id}`);
  });
});

server.listen(3000, () => {
  console.log('服务监听 3000 端口');
});
