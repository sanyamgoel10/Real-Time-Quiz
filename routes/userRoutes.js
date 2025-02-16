const express = require("express");
const router = express.Router();

// Controllers
const { homepage, loginPage, userLogin, registerPage, registerNewUser } = require('../controllers/loginController.js');

// Services
// const validateUser = require('../services/validateUser.js');

// Routes
router.get('/', homepage);

router.get('/login', loginPage);
router.post('/login', userLogin);

router.get('/register', registerPage);
router.post('/register', registerNewUser);


module.exports = router;