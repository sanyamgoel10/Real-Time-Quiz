const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    quizStatus: {
        type: String,
        enum: ['idle', 'ingame'],
        default: 'idle',
        required: true,
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'QuizRooms',
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Users = mongoose.model("Users", userSchema);

module.exports = Users;
