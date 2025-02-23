const config = require("../config/config.js");
const mongoose = require("mongoose");

const Users = require('./models/users.js');
const QuizQuestions = require('./models/quizquestions.js');
const QuizRooms = require('./models/quizrooms.js');

class DatabaseService{
    // Connect to Database on server start
    async connectDB(){
        try {
            await mongoose.connect(`mongodb://${config.dbHost}:${config.dbPort}/${config.dbName}`);
            console.log('Database is connected');
        } catch (err) {
            console.error('Error connecting to the database:', err);
            process.exit(1);
        }
    }

    // Quiz Database Related
    async initializeQuestions(){
        const questions = [
            {
                question: "What is the capital of France?",
                options: ["Berlin", "Madrid", "Paris", "Rome"],
                correctOptionIndex: 2
            },
            {
                question: "What is the capital of Germany?",
                options: ["Berlin", "Madrid", "Paris", "Rome"],
                correctOptionIndex: 0
            },
            {
                question: "Who developed the theory of relativity?",
                options: ["Isaac Newton", "Albert Einstein", "Galileo Galilei", "Nikola Tesla"],
                correctOptionIndex: 1
            },
            {
                question: "Which planet is known as the Red Planet?",
                options: ["Earth", "Mars", "Jupiter", "Saturn"],
                correctOptionIndex: 1
            },
            {
                question: "Which gas is most abundant in Earth's atmosphere?",
                options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Argon"],
                correctOptionIndex: 1
            },
            {
                question: "What is the capital of Japan?",
                options: ["Seoul", "Tokyo", "Beijing", "Bangkok"],
                correctOptionIndex: 1
            },
            {
                question: "Which element has the chemical symbol 'O'?",
                options: ["Gold", "Oxygen", "Osmium", "Oxide"],
                correctOptionIndex: 1
            },
            {
                question: "Who wrote 'Romeo and Juliet'?",
                options: ["William Shakespeare", "Charles Dickens", "Mark Twain", "Jane Austen"],
                correctOptionIndex: 0
            },
            {
                question: "Which planet is known as the 'Morning Star'?",
                options: ["Mars", "Venus", "Mercury", "Jupiter"],
                correctOptionIndex: 1
            },
            {
                question: "What is the largest ocean on Earth?",
                options: ["Indian Ocean", "Pacific Ocean", "Atlantic Ocean", "Arctic Ocean"],
                correctOptionIndex: 1
            },
            {
                question: "Who developed the first successful polio vaccine?",
                options: ["Alexander Fleming", "Jonas Salk", "Marie Curie", "Louis Pasteur"],
                correctOptionIndex: 1
            },
            {
                question: "Which programming language is known for its snake logo?",
                options: ["Java", "C++", "Python", "Ruby"],
                correctOptionIndex: 2
            },
            {
                question: "How many continents are there on Earth?",
                options: ["5", "6", "7", "8"],
                correctOptionIndex: 2
            },
            {
                question: "Which gas do plants primarily use for photosynthesis?",
                options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
                correctOptionIndex: 2
            },
            {
                question: "What is the speed of light in vacuum?",
                options: ["300,000 km/s", "150,000 km/s", "100,000 km/s", "250,000 km/s"],
                correctOptionIndex: 0
            },
            {
                question: "What is the hardest natural substance on Earth?",
                options: ["Gold", "Iron", "Diamond", "Quartz"],
                correctOptionIndex: 2
            },
            {
                question: "Which country is known for inventing pizza?",
                options: ["France", "Italy", "USA", "Spain"],
                correctOptionIndex: 1
            },
            {
                question: "Who painted the Mona Lisa?",
                options: ["Leonardo da Vinci", "Vincent van Gogh", "Pablo Picasso", "Claude Monet"],
                correctOptionIndex: 0
            },
            {
                question: "What is the smallest unit of life?",
                options: ["Atom", "Molecule", "Cell", "Organ"],
                correctOptionIndex: 2
            },
            {
                question: "What is the capital of India?",
                options: ["Mumbai", "Kolkata", "Bengaluru", "Delhi"],
                correctOptionIndex: 3
            },
        ];
        for(let i in questions){
            let currQuestion = questions[i];
            currQuestion['qid'] = Number(i) + 1;
            if(!(await QuizQuestions.findOne({question: currQuestion['question']}))){
                await QuizQuestions.insertOne(currQuestion);
            }
        }
    }

    async getRandomQuizQuestions(){
        return await QuizQuestions.aggregate([
            { $sample: { size: config.MaxQuizQuestions } },
        ]);
    }

    // User Register/Login
    async validateUserName(username){
        let findExistingUname = await Users.findOne({
            username: username
        });
        if(findExistingUname){
            return true;
        }
        return false;
    }

    async findUserByUsername(username){
        return await Users.findOne({
            username: username
        });
    }

    async registerNewUser(userDetails){
        let newUser = new Users(userDetails);
        await newUser.save();
    }

    // Quiz Related
    async changeUserStatus(userName, status, roomId=null){
        await Users.updateOne({
            username: userName
        }, {
            $set: {
                quizStatus: status,
                roomId: roomId
            }
        });
    }

    async checkUserStatus(userName){
        let userData = await Users.findOne({
            username: userName
        });
        return {
            status: userData.quizStatus,
            roomId: userData.roomId
        };
    }

    async getAwaitingGameRoom(){
        return await QuizRooms.findOne({
            status: 'awaiting'
        });
    }

    async createNewQuizRoom(){
        let newRoom = new QuizRooms({
            questions: await this.getRandomQuizQuestions(),
        });
        await newRoom.save();
        return newRoom;
    }

    async joinQuizRoom(roomId, userName) {
        try {
            const roomDetails = await QuizRooms.findById(roomId);
            if (!roomDetails) {
                throw new Error('Quiz room not found');
            }
    
            if (roomDetails.players.length >= 2) {
                throw new Error('Quiz room is already full');
            }

            await QuizRooms.updateOne(
                { _id: roomId },
                {
                    $push: {
                        players: {
                            username: userName,
                            score: 0,
                        },
                    },
                }
            );
    
            if (roomDetails.players.length === 1) {
                await QuizRooms.updateOne(
                    { _id: roomId },
                    {
                        $set: {
                            status: 'inprogress',
                            startedAt: Date.now(),
                        },
                    }
                );
            }

            await this.changeUserStatus(userName, 'ingame', roomId);

            console.log(`User ${userName} joined quiz room ${roomId}`);
            return true;
        } catch (error) {
            console.error('Error joining quiz room:', error.message);
            return false;
        }
    }    

    async completeActiveQuizRoom(roomId){
        try{
            const quizRoom = await QuizRooms.findById(roomId);
            if (!quizRoom) {
                throw new Error('Quiz room not found');
            }
            if (quizRoom.players.length == 2) {
                const winner = quizRoom.players.reduce((prev, curr) => 
                    (curr.score === prev.score) ? null : (curr.score > prev.score ? curr : prev)
                );
                await QuizRooms.updateOne(
                    { _id: roomId },
                    {
                        $set: {
                            winner: winner ? winner.username : null,
                            status: 'completed',
                            completedAt: Date.now(),
                        },
                    }
                );
                console.log(`Quiz room ${roomId} completed. Winner: ${winner ? winner.username : 'None (tie)'}`);
            } else {
                await QuizRooms.updateOne(
                    { _id: roomId },
                    {
                        $set: {
                            status: 'expired',
                            completedAt: Date.now(),
                        },
                    }
                );
                console.log(`Quiz room ${roomId} expired due to insufficient players.`);
            }
        }catch(error){
            console.error('Error joining quiz room:', error.message);
            return false;
        }
    }
}

module.exports = new DatabaseService();