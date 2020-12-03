安装运行命令

```js
cnpm i &&npm run server
```

然后用浏览器打开下面网页即可.
index.html

### websocket 介绍

W3C 在 HTML5 中提供了一种让客户端与服务器之间进行全双工通讯的网络技术 WebSocket。

#### 我们先来看 WebSocket 的一个使用方式：

```js
const ws = new WebSocket("ws//:xxx.xx", [protocol]);

ws.onopen = () => {
  ws.send("hello");
  console.log("send");
};

ws.onmessage = (ev) => {
  console.log(ev.data);
  ws.close();
};

ws.onclose = (ev) => {
  console.log("close");
};

ws.onerror = (ev) => {
  console.log("error");
};
```

WebSocket 实例化后，前端可以通过上面介绍的方法进行对应的操作，看起来还是蛮简单的。

#### 服务端代码

```js
let express = require("express");
let app = express();
let server = require("http").createServer(app);
let io = require("socket.io")(server);
let path = require("path");

app.use("/", (req, res, next) => {
  res.status(200).sendFile(path.resolve(__dirname, "index.html"));
});

// 开启 socket.io
io.on("connection", (client) => {
  // 如果有新客户端进来，显示 ID
  console.log(`客户端 ID：${client.id}`);

  // 监听客户端的输入信息
  client.on("channel", (data) => {
    console.log(`客户端 ${client.id} 发送信息 ${data}`);
    io.emit("broadcast", data);
  });

  // 判断客户端是否关闭
  client.on("disconnect", () => {
    console.log(`客户端关闭：${client.id}`);
  });
});

server.listen(3000, () => {
  console.log("服务监听 3000 端口");
});
```

#### 客户端代码

```js
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Socket.io</title>
  <script src="https://cdn.bootcss.com/socket.io/2.2.0/socket.io.slim.js"></script>
</head>

<body>

  <input type="text" id="input">
  <button id="btn">send</button>
  <div id="content-wrap"></div>

  <script>
    window.onload = function () {
      let inputValue = null;

      // 连接 socket.io
      let socket = io('http://localhost:3000');
      // 将创建的信息以添加 p 标签的形式展示成列表
      socket.on('broadcast', data => {
        let content = document.createElement('p');
        content.innerHTML = data;
        document.querySelector('#content-wrap').appendChild(content);
      })

      // 设置输入框的内容
      let inputChangeHandle = (ev) => {
        inputValue = ev.target.value;
      }
      // 获取输入框并监听输入
      let inputDom = document.querySelector("#input");
      inputDom.addEventListener('input', inputChangeHandle, false);

      // 当用户点击发送信息的时候，进行数据交互
      let sendHandle = () => {
        socket.emit('channel', inputValue);
      }
      let btnDom = document.querySelector("#btn");
      btnDom.addEventListener('click', sendHandle, false);

      // 打页面卸载的时候，通知服务器关闭
      window.onunload = () => {
        btnDom.removeEventListener('click', sendHandle, false);
        inputDom.removeEventListener('input', inputChangeHandle, false);
      }
    };
  </script>
</body>

</html>

```
