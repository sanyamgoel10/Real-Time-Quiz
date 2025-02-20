const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.set('view engine','ejs');
app.use(cookieParser());

// Routes
const userRoutes = require('./routes/userRoutes.js');
const gameRoutes = require('./routes/gameRoutes.js');

// User Routes
app.use('/', userRoutes);

// Game Routes
app.use('/game', gameRoutes);

// 404 Error Handler
app.use((req, res) => {
    return res.status(404).json({
        error: "Invalid URL"
    });
});

module.exports = app;