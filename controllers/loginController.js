const User = require('../services/models/users.js');
const encryptPass = require('../services/encDecPass.js');
const encDecToken = require('../services/encDecJwtToken.js');

class LoginController{
    async homepage(req, res){
        return res.redirect('/login');
    }

    async loginPage(req, res){
        return res.render('login');
    }

    async userLogin(req, res){
        if('undefined' == typeof req.body.username || 'undefined' == typeof req.body.password){
            let errResp = `Username, Password or ReEnterPassword not found`;
            console.log(`Error: ${errResp}`);
            return res.render('login', {msg: `${errResp}`});
        }

        let uName = req.body.username;
        let pass = req.body.password;

        let findExistingUname = await User.findOne({
            username: uName
        });

        if('undefined' == typeof findExistingUname || findExistingUname == null){
            let errResp = `Invalid Username, user not found`;
            console.log(`Error: ${errResp}`);
            return res.render('login', {msg: `${errResp}`});
        }

        if(await encryptPass.comparePassword(pass, findExistingUname.password)){
            let userToken = findExistingUname.token;
            return res.cookie('userToken', userToken, { httpOnly: true, secure: true, sameSite: "strict" }).redirect(`/game`);
        }else{
            let errResp = `Invalid Password`;
            console.log(`Error: ${errResp}`);
            return res.render('login', {msg: `${errResp}`});
        }
    }

    async registerPage(req, res){
        return res.render('register');
    }

    async registerNewUser(req, res){
        try{
            if('undefined' == typeof req.body.username || 'undefined' == typeof req.body.password || 'undefined' == typeof req.body.reenterpassword){
                let errResp = `Username, Password or ReEnterPassword not found`;
                console.log(`Error: ${errResp}`);
                return res.render('register', {msg: `${errResp}`});
            }

            let uName = req.body.username;
            let pass = req.body.password;
            let rPass = req.body.reenterpassword;

            if('string' != typeof uName || uName.includes(' ')){
                let errResp = `Username should be non-empty string`;
                console.log(`Error: ${errResp}`);
                return res.render('register', {msg: `${errResp}`});
            }
            if('string' != typeof pass || pass.includes(' ')){
                let errResp = `Password should be non-empty string`;
                console.log(`Error: ${errResp}`);
                return res.render('register', {msg: `${errResp}`});
            }
            if(pass != rPass){
                let errResp = `Passwords dont match`;
                console.log(`Error: ${errResp}`);
                return res.render('register', {msg: `${errResp}`});
            }

            let findExistingUname = await User.findOne({
                username: uName
            });

            if(findExistingUname){
                let errResp = `Username already found`;
                console.log(`Error: ${errResp}`);
                return res.render('register', {msg: `${errResp}`});
            }

            let userToken = await encDecToken.createNewToken({
                username: uName,
                time: Date()
            });
            if(!userToken){
                let errResp = `Something went wrong in token creation`;
                console.log(`Error: ${errResp}`);
                return res.render('error');
            }

            const newUser = new User({
                username: uName,
                password: await encryptPass.hashPassword(pass),
                token: userToken,
            });
            await newUser.save();

            return res.cookie('userToken', userToken, { httpOnly: true, secure: true, sameSite: "strict" }).redirect(`/game`);
        }catch(error){
            console.log("Error: ", error);
            return res.render('error');
        }
    }

    async userLogout(req, res){
        return res.clearCookie('userToken').redirect('/');
    }
}

module.exports = new LoginController();