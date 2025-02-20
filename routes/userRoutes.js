const express = require("express");
const router = express.Router();

// Controllers
const { homepage, loginPage, userLogin, registerPage, registerNewUser, userLogout } = require('../controllers/loginController.js');

// Routes
router.get('/', homepage);

router.get('/login', loginPage);
router.post('/login', userLogin);

router.get('/register', registerPage);
router.post('/register', registerNewUser);

router.get('/logout', userLogout);

module.exports = router;