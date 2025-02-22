const express = require("express");
const router = express.Router();

// Controllers
const { landingpage, searchGame } = require('../controllers/GameController.js');

// Services
const { validateUserLogin } = require('../middleware/authMiddleware.js');

// Routes
router.get('/', validateUserLogin, landingpage);
router.get('/start', validateUserLogin, searchGame)

module.exports = router;