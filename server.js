const { connectDB, initializeQuestions } = require("./services/DatabaseService.js");

const config = require("./config/config.js");

// Express App
const PORT = config.port || 3000;
const app = require("./app.js");

// Initiate a http server
const http = require('http');
const server = http.createServer(app);

// Import Websocket server
const { initializeSocketIO } = require('./wsServer.js');

const startServer = async () => {
    try {
        // Connect to database
        await connectDB();

        // Initialize questions in database
        await initializeQuestions();
        
        // Initialize a websocket server
        await initializeSocketIO(server);

        // Start Server
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();