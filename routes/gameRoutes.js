const express = require("express");
const router = express.Router();

// Controllers
const { landingpage, searchGame } = require('../controllers/gameController.js');

// Middleware
const { verifyJwt } = require('../middleware/validateUserReq.js');

// Routes
router.get('/', verifyJwt, landingpage);
router.get('/start', verifyJwt, searchGame)

module.exports = router;