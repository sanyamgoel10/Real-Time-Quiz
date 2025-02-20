const { connectDB } = require("./services/db.js");

const config = require("./config/config.js");

// Express App
const PORT = config.port || 3000;
const app = require("./app.js");

// Websocket App
const WebSocket = require('ws');
const http = require('http');
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const startServer = async () => {
    try {
        await connectDB();
        
        // Websocket connection start
        wss.on('connection', async (ws) => {
            console.log('A new client has connected to websocket.');
            ws.on('message', async (message) => {
                console.log(`Received: ${message} from client`);
                // Broadcast message to all users connected to websocket server
                await broadcastMessageOnWs(wss, message);
            });
            // Websocket Connection Closing
            ws.on('close', () => {
                console.log('A client has disconnected.');
            });
        });

        // Start Server
        server.listen(PORT, () => {
            console.log(`Server & WebSocket running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

async function broadcastMessageOnWs(wss, message){
    let allClients = wss.clients;
    allClients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

startServer();