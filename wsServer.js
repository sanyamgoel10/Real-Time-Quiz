const socketIO = require('socket.io');
const DatabaseService = require('./services/DatabaseService.js');

let roomSocketMap = {};

const initializeSocketIO = async (server) => {
    const io = socketIO(server);
    io.on('connection', oneConnection);
    return io;
};

module.exports = { initializeSocketIO };

async function oneConnection(socket){
    console.log(`New client connected: ${socket.id}`);

    let userName = null;

    socket.on('StartGame', async (data) => {
        console.log(`Message from Client: `, data);

        userName = data.username;
        console.log("userName: ", userName);

        let userQuizStatus = await DatabaseService.checkUserStatus(userName);
        if(userQuizStatus.status == 'idle'){
            let getAwaitingGameRoom = await DatabaseService.getAwaitingGameRoom();
            let roomId;
            if(getAwaitingGameRoom){
                roomId = getAwaitingGameRoom['_id'];
            }else{
                let newRoom = await DatabaseService.createNewQuizRoom();
                roomId = newRoom['_id'];
            }
            await DatabaseService.joinQuizRoom(roomId, userName);
            await mapRoomToSockets(roomId, socket.id);
        }else{
            let userCurrRoomId = userQuizStatus.roomId;
            await mapRoomToSockets(userCurrRoomId, socket.id);
        }
    });

    // socket.join(quizId); // Join the room
    // // Broadcast to all clients in the room
    // io.to(quizId).emit('userJoined', { userId });
    // // Broadcast the answer to all clients in the room
    // io.to(quizId).emit('answerSubmitted', { userId, answer });

    // Handle disconnection
    socket.on('disconnect', async () => {
        if(userName){
            let userDetails = await DatabaseService.checkUserStatus(userName);
            if(userDetails.status != 'idle'){
                await DatabaseService.completeActiveQuizRoom(userDetails.roomId);
                await removeSocketConnectionFromRoom(userDetails.roomId, socket.id);
            }
            await DatabaseService.changeUserStatus(userName, 'idle'); 
        }
        console.log(`Client disconnected: ${socket.id}`);
    });
} 

async function mapRoomToSockets(roomId, socketId){
    if(!roomSocketMap[roomId]){
        roomSocketMap[roomId] = [];
    }
    roomSocketMap[roomId].push(socketId);
    console.log("roomSocketMap on connect: ", roomSocketMap);
}

async function removeSocketConnectionFromRoom(roomId, socketId){
    if(roomSocketMap[roomId]){
        roomSocketMap[roomId] = roomSocketMap[roomId].filter((currSocket) => { return currSocket != socketId; });
    }
    console.log("roomSocketMap on disconnect: ", roomSocketMap);
}