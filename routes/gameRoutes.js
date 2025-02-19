const express = require("express");
const router = express.Router();

// Controllers
const { landingpage } = require('../controllers/gameController.js');

// Middleware
const { verifyJwt } = require('../middleware/validateUserReq.js');

// Routes
router.get('/:token', verifyJwt, landingpage);

module.exports = router;