const mongoose = require("mongoose");
const { MaxQuizQuestions } = require('../../config/config.js');

const quizRoomsSchema = new mongoose.Schema({
    player1: {
        username: {
            type: String,
            requried: true,
            default: null
        },
        score: {
            type: Number,
            default: 0,
            min: 0,
            max: MaxQuizQuestions
        },
        isWinner: {
            type: Boolean,
            default: 0,
            required: true
        }
    },
    player2: {
        username: {
            type: String,
            requried: true,
            default: null
        },
        score: {
            type: Number,
            default: 0,
            min: 0,
            max: MaxQuizQuestions
        },
        isWinner: {
            type: Boolean,
            default: 0,
            required: true
        }
    },
    questions: {
        type: Array,
        required: true
    },
    status: {
        type: String,
        enum: ['awaiting', 'inprogress', 'completed', 'expired'],
        required: true,
        default: 'awaiting',
    },
    createdAt: { 
        type: Date, 
        default: Date.now()
    },
    startedAt: { 
        type: Date 
    },
    completedAt: { 
        type: Date 
    }    
});

const QuizRooms = mongoose.model("QuizRoom", quizRoomsSchema);

module.exports = QuizRooms;
