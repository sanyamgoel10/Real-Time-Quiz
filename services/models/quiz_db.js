const mongoose = require("mongoose");

const questionsSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
        unique: true
    },
    options: {
        type: [String],
        validate: {
            validator: function (arr) {
                return arr.length == 4;
            },
            message: "Each question must have exactly four options."
        },
        required: true
    },
    correctOptionIndex: {
        type: Number,
        required: true,
        min: 0,
        max: 3
    }
}, { timestamps: true });

const QuizQuestions = mongoose.model("QuizQuestion", questionsSchema);

module.exports = QuizQuestions;
