const socketIO = require('socket.io');
const DatabaseService = require('./services/DatabaseService.js');

const Users = require('./services/models/users.js');
const QuizRooms = require('./services/models/quizrooms.js');

const initializeSocketIO = async (server) => {
    const io = socketIO(server);
    io.on('connection', (socket) => oneConnection(io, socket));
    return io;
};

module.exports = { initializeSocketIO };

async function oneConnection(io, socket) {
    console.log(`New client connected: ${socket.id}`);

    let socketUserName;

    socket.on('SearchGame', async ({ username }) => {
        console.log(`${username} is searching for a game...`);

        socketUserName = username;

        const user = await Users.findOne({ username });

        if (!user) {
            socket.emit('error', { message: 'User not found!' });
            return;
        }

        if(!user.ingame){
            user.ingame = true;
            await user.save();

            // Find an available game
            let game = await QuizRooms.findOne({ status: 'awaiting' });

            if (game) {
                // Join the existing game
                game.player2.username = username;
                game.status = 'inprogress';
                game.startedAt = new Date();
                await game.save();

                socket.join(game.id);

                io.to(game.id).emit('StartGame', {
                    Opponent: {
                        [game.player1.username]: game.player2.username,
                        [game.player2.username]: game.player1.username,
                    }
                });
                await sendQuestionsOneByOne(io, game.id, game);
            } else {
                // Create a new game
                const gameId = `game_${Date.now()}`;
                game = new QuizRooms({
                    id: gameId,
                    player1: { username, score: 0 },
                    player2: { username: null, score: 0 },
                    questions: await DatabaseService.getRandomQuizQuestions(),
                    status: 'awaiting',
                    winner: 0,
                    createdAt: new Date(),
                });
                await game.save();

                socket.join(gameId);
            }
        }else{
            socket.emit('InProgress', {});
        }
    });

    // **Handle answer submission**
    socket.on('SubmitAnswer', async ({ Username, QuestionId, SelectedOption }) => {
        let roomId = Array.from(socket.rooms)[1];
        let game = await QuizRooms.findOne({ id: roomId });
        if(game){
            let player = (game.player1.username == Username) ? game.player1 : game.player2;
            let question = game.questions[Number(QuestionId)];
            if(Number(SelectedOption) == Number(question.correctOptionIndex)){
                player.score++;
            }
            if(game.player1.username == Username){
                game.player1 = player;
            }else{
                game.player2 = player;
            }
            await game.save();
        }
    });

    // **Handle disconnection**
    socket.on('disconnect', async () => {
        console.log(`Client disconnected: ${socket.id}`);
        const user = await Users.findOne({ username: socketUserName });
        if (user) {
            user.ingame = false;
            await user.save();
        }
    });
}

async function sendQuestionsOneByOne(io, roomId, game){
    let quizQuestions = game['questions'];
    let i = 0;
    const interval = setInterval(async () => {
        if (i < quizQuestions.length) {
            io.to(roomId).emit('NewQuestion', {
                QuestionId: i,
                Question: quizQuestions[i].question,
                Options: quizQuestions[i].options,
            });
            i++;
        } else {
            await declareGameResult(io, roomId, game);
            clearInterval(interval);
        }
    }, 20000);
}

async function declareGameResult(io, roomId, game){
    let winner = await completeQuizAndDeclareResult(roomId);
    io.to(roomId).emit('QuizEnd', {
        Winner: winner
    });
}

async function completeQuizAndDeclareResult(roomId){
    let game = await QuizRooms.findOne({ id: roomId });

    let winner;
    if(game.player1.score == game.player2.score){
        winner = null;
    }else if(game.player1.score > game.player2.score){
        winner = game.player1.username;
    }else{
        winner = game.player2.username;
    }

    if(winner){
        game.winner = winner;
    }
    game.status = 'completed';
    game.completedAt = Date.now();
    await game.save();

    return winner;
}