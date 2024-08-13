const express = require('express');
const app = express();
const cryptoHandler = require('./utils/crypto')
const cors = require('cors');

// 引入外部路由文件
const apiRouter = require('./router/apiRouter')
// 注册路由, 注册的路由模块接口访问都需要加上 注册路由的前缀
app.use('/api', apiRouter)

// 使用cors中间件
app.use(cors({
    origin: '*', // 允许来自任何源的请求
    methods: ['GET', 'POST', 'PUT', 'DELETE'] // 允许的HTTP方法
}));

const port = 8080;

app.use(express.json());

// 处理 / 根请求
app.get('/', (req, res) => {
    const filePath = __dirname + '/public/pages/index.html';
    res.sendFile(filePath);
});

// 处理 GET 请求 /get ，参数 a，并且返回 a参数值
app.get('/get', (req, res) => {
    const {
        a
    } = req.query;
    res.send(a);
});

// 处理 POST 请求 /post，接受 JSON 参数并返回相同的 JSON 参数
app.post('/post', (req, res) => {
    const jsonData = req.body;

    console.info(jsonData)

    res.json(jsonData);
});


app.get('/encryptByAES', (req, res) => {
    const {
        message
    } = req.query
    if (message == undefined || message.length == 0) {
        res.send('消息为空')
        return
    }
    res.send(`加密后的消息：${cryptoHandler.encryptByAES(message)}`);
});

app.get('/decryptByAES', (req, res) => {
    const {
        message
    } = req.query
    if (message == undefined || message.length == 0) {
        res.send('消息为空')
        return
    }
    res.send(`解密后的消息：${cryptoHandler.decryptByAES(message)}`);
});

app.listen(port, () => {
    console.log(`api-service 服务已启动,访问地址：http://127.0.0.1:${port}`);
});