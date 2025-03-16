const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws, req) => {
    console.log('Client connected from:', req.socket.remoteAddress);

    ws.on('message', (message) => {
        console.log('Received message:', message.toString());
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

app.get('/', (req, res) => {
    res.send('WebSocket server is running');
});

server.listen(8080, '0.0.0.0', () => {
    console.log('Server running on http://0.0.0.0:8080');
});