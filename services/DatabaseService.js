const config = require("../config/config.js");
const mongoose = require("mongoose");

const QuizQuestions = require('./models/quizquestions.js');
const Users = require('./models/users.js');
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

    // User Register/Login
    async validateUserName(username){
        try {
            const findExistingUname = await Users.findOne({ username });
            return findExistingUname ? true : false;
        } catch (error) {
            console.error('Error validating username:', error.message);
            throw error;
        }
    }

    async findUserByUsername(username){
        try {
            return await Users.findOne({ username });
        } catch (error) {
            console.error('Error finding user by username:', error.message);
            throw error;
        }

    }

    async registerNewUser(userDetails){
        try {
            const newUser = new Users(userDetails);
            await newUser.save();
            console.log(`New user registered: ${userDetails['username']}`);
        } catch (error) {
            console.error('Error registering new user:', error.message);
            throw error;
        }
    }

    // Quiz Related
    async getRandomQuizQuestions(){
        let result = [];
        for(let i = 0; i < config.MaxQuizQuestions; i++){
            let randI = Math.floor(Math.random() * QuizQuestions.length);
            while(result.includes(randI)){
                randI = Math.floor(Math.random() * QuizQuestions.length);
            }
            result.push(randI);
        }
        for(let i in result){
            result[i] = QuizQuestions[result[i]];
        }
        return result;
    }

    async createEmptyQuizRoom(){
        let currDate = new Date();
        let roomId = (String(currDate.getFullYear()) + String(Number(currDate.getMonth()) + 1) + String(currDate.getDate()) + String(currDate.getTime()) + String((Math.random() + 1).toString(36).substring(7)));
        let newRoom = await QuizRooms({
            id: roomId,
            questions: await this.getRandomQuizQuestions()
        });
        await newRoom.save();
        return roomId;
    }

    async findRoomByStatus(status = "awaiting"){
        return await QuizRooms.findOne({status });
    }

    async getUserQuizStatus(username){
        return (await Users.findone({ username }))['ingame'];
    }

    async updateUserQuizStatus(username, ingame){
        await Users.updateOne({ username }, {
            $set: { ingame }
        });
    }

    async updateQuizRoomStatus(roomId, status){
        if(status == 'inprogress'){
            await QuizRooms.updateOne({ id: roomId }, {
                $set: { 
                    status,
                    startedAt: Date.now()
                }
            });
        }else if(status == 'completed' || status == 'expired'){
            await QuizRooms.updateOne({ id: roomId }, {
                $set: { 
                    status,
                    completedAt: Date.now()
                }
            });
        }else{
            await QuizRooms.updateOne({ id: roomId }, {
                $set: { status }
            });
        }
    }

    async joinUserRoom(username, roomId){
        if(await this.getUserQuizStatus(username)){
            // User already in game
            return false;
        }
        let quizRoom = await QuizRooms.findOne({ id: roomId });
        if(!quizRoom){
            // Room not found
            return false;
        }
        if(quizRoom['status'] != 'awaiting'){
            // Room full
            return false;
        }

        if(quizRoom['player1']['username'] && !quizRoom['player2']['username']){
            await QuizRooms.updateOne({ id: roomId }, {
                $set: {
                    player2: {
                        username,
                        score: 0,
                        isWinner: 0
                    },
                }
            });
            await this.updateQuizRoomStatus(roomId, 'inprogress');
        }else if(quizRoom['player2']['username'] && !quizRoom['player1']['username']){
            await QuizRooms.updateOne({ id: roomId }, {
                $set: {
                    player1: {
                        username,
                        score: 0,
                        isWinner: 0
                    },
                }
            });
            await this.updateQuizRoomStatus(roomId, 'inprogress');
        }else{
            await QuizRooms.updateOne({ id: roomId }, {
                $set: {
                    player1: {
                        username,
                        score: 0,
                        isWinner: 0
                    }
                }
            });
        }

        await this.updateUserQuizStatus(username, true);

        return true;
    }
}

module.exports = new DatabaseService();