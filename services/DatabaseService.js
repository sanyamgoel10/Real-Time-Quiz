const config = require("../config/config.js");
const mongoose = require("mongoose");

const QuizQuestions = require('./models/quizquestions.js');
const Users = require('./models/users.js');

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
}

module.exports = new DatabaseService();