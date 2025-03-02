require('dotenv').config();
const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const gameSocket = require('./sockets/gameSocket');

const app = express();
const port = 8000;

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
gameSocket(io);
app.set('io', io); // 讓全域可用


// 連接資料庫
// require('./config/database');

// 解析 JSON
// app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));


// 掛載路由
// const userRoutes = require('./routes/userRoutes');
// app.use('/api', userRoutes);

const gameRoutes = require('./routes/gameRoutes');
app.use('/api/game', gameRoutes);

app.get("/", (req, res) => {
    res.sendFile('index.html', { root: __dirname });
});


// 啟動伺服器
server.listen(port,"::", () => {
    console.log(`🚀 伺服器運行中：http://localhost:${port}`);
});
