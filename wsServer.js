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

            socket.UserName = data.username;

            let gameStarted = false;
            let roomId;
            let awaitQuiz = await DatabaseService.findRoomByStatus();
            if(awaitQuiz){
                gameStarted = true;
                roomId = awaitQuiz['id'];
                await DatabaseService.joinUserRoom(socket.UserName, roomId);
            }else{
                roomId = await DatabaseService.createQuizRoom();
            }
            await DatabaseService.joinUserRoom(socket.UserName, roomId);
            socket.join(roomId);

            // Send questions one by one
            // let p1 = awaitQuiz['player1']['username'] ? awaitQuiz['player1']['username'] : awaitQuiz['player2']['username'];
            // let p2 = currUserName;
            // let questionsList = awaitQuiz['questions'];
            // socket.emit('NewQuestion', {
            //     Question: questionsList[0]['question'],
            //     Option1: questionsList[0]['question'][0],
            //     Option2: questionsList[0]['question'][1],
            //     Option3: questionsList[0]['question'][2],
            //     Option4: questionsList[0]['question'][3],
            // })

            io.sockets.in(roomId).emit('NewQuestion', 'hello for new question');
        }catch (error) {
            console.error('Error handling StartGame event:', error.message);
        }
    });

    socket.on('disconnect', async () => {
        console.log(`Client disconnected: ${socket.id}`);

        console.log("Client Rooms: ", socket.rooms);
        console.log("On Disconnect UserName: ", socket.UserName);
        await DatabaseService.updateUserInGameStatus(socket.UserName, false);
    });
}