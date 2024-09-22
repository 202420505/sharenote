// server.js
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

// Express 앱 설정
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// 클라이언트로부터의 WebSocket 연결 처리
wss.on('connection', (ws) => {
    console.log('New client connected');

    // 클라이언트로부터 메시지를 받으면 모든 클라이언트에게 브로드캐스트
    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);
        broadcast(message, ws);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// 다른 클라이언트에게 메시지 브로드캐스트
function broadcast(message, sender) {
    wss.clients.forEach((client) => {
        if (client !== sender && client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

// 정적 파일 서비스 (프론트엔드)
app.use(express.static('public'));

// 서버 시작
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
