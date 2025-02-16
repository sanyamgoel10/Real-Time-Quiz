const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.set('view engine','ejs');

// Routes
const userRoutes = require('./routes/userRoutes.js');

// Use Routes
app.use('/', userRoutes);

// 404 Error Handler
app.use((req, res) => {
    return res.status(404).json({
        error: "Invalid URL"
    });
});

module.exports = app;