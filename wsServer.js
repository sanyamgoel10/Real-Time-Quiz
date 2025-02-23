const socketIO = require('socket.io');
const DatabaseService = require('./services/DatabaseService.js');

const initializeSocketIO = async (server) => {
    const io = socketIO(server);
    io.on('connection', (socket) => oneConnection(io, socket));
    return io;
};

module.exports = { initializeSocketIO };

async function oneConnection(io, socket) {
    console.log(`New client connected: ${socket.id}`);
    
    socket.on('StartGame', async (data) => {
        try {
            console.log(`Message from Client: `, data);
        }catch (error) {
            console.error('Error handling StartGame event:', error.message);
        }
    });

    socket.on('disconnect', async () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
}