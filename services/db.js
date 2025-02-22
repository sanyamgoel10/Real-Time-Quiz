const config = require("../config/config.js");
const mongoose = require("mongoose");
const QuizQuestions = require('./models/quiz_db.js');

const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb://${config.dbHost}:${config.dbPort}/${config.dbName}`);
        console.log('Database is connected');
    } catch (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1);
    }
};

const initializeQuestions = async () => {
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
        }
    ];
    await QuizQuestions.insertMany(questions);
}

module.exports = { connectDB, initializeQuestions };