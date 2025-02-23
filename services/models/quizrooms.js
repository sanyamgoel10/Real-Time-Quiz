const mongoose = require("mongoose");
const { MaxQuizQuestions } = require('../../config/config.js');

const quizRoomsSchema = new mongoose.Schema({
    players: [
        {
            username: { 
                type: String, 
                required: true 
            },
            score: { 
                type: Number, 
                default: 0,
                min: 0,
                max: MaxQuizQuestions
            },
        },
    ],
    winner: { 
        type: String, 
        ref: 'User',
        default: null,
    },
    status: {
        type: String,
        enum: ['awaiting', 'inprogress', 'completed', 'expired'],
        required: true,
        default: 'awaiting',
    },
    questions: [
        {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'QuizQuestion',
        },
    ],
    currentQuestion: { 
        type: Number, 
        default: 0 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    startedAt: { 
        type: Date 
    },
    completedAt: { 
        type: Date 
    },
});

const QuizRooms = mongoose.model("QuizRoom", quizRoomsSchema);

module.exports = QuizRooms;
