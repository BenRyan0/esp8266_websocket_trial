const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Serve static files from "public" directory
app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws, req) => {
    console.log(`✅ Client connected from: ${req.socket.remoteAddress}`);

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message.toString());

            // Validate message format
            if (typeof data.parking_space === 'string' && typeof data.is_available === 'number') {
                console.log('📩 Valid message received:', data);

                // Broadcast message to all connected clients
                wss.clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify(data));
                    }
                });
            } else {
                console.warn('⚠️ Invalid message format:', data);
                ws.send(JSON.stringify({ error: 'Invalid message format' }));
            }
        } catch (error) {
            console.error('❌ Invalid JSON received:', error);
            ws.send(JSON.stringify({ error: 'Invalid JSON' }));
        }
    });

    ws.on('close', () => {
        console.warn('🔌 Client disconnected');
    });
});

// Serve index.html as default
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server on all network interfaces (for Render)
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running at https://esp8266-websocket-trial.onrender.com`);
});
