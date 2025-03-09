const express = require("express");
const router = express.Router();

// Controllers
const { homepage, loginPage, userLogin, registerPage, registerNewUser, userLogout } = require('../controllers/UserController.js');

// Middleware
const { checkAlreadyLoggedIn } = require('../middleware/authMiddleware.js');

// Routes
router.get('/', checkAlreadyLoggedIn, homepage);

router.get('/login', checkAlreadyLoggedIn, loginPage);
router.post('/login', userLogin);

router.get('/register', checkAlreadyLoggedIn, registerPage);
router.post('/register', registerNewUser);

router.get('/logout', userLogout);

module.exports = router;
