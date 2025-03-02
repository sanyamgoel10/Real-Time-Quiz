const mongoose = require("mongoose");
const { MaxQuizQuestions } = require('../../config/config.js');

const quizRoomsSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
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
        }
    },
    winner: {
        type: String,
        default: null,
        required: true
    },
    questions: {
        type: Array,
        required: true
    },
    status: {
        type: String,
        enum: ['awaiting', 'inprogress', 'completed'],
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
