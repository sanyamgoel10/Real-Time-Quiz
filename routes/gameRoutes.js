const express = require("express");
const router = express.Router();

// Controllers
const { landingpage, searchGame } = require('../controllers/GameController.js');

// Routes
router.get('/', landingpage);
router.get('/start', searchGame)

module.exports = router;