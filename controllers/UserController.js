const DatabaseService = require('../services/DatabaseService.js');
const PasswordService = require('../services/PasswordService.js');
const TokenService = require('../services/TokenService.js');

class UserController{
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

        let findExistingUname = await DatabaseService.findUserByUsername(uName);

        if('undefined' == typeof findExistingUname || findExistingUname == null){
            let errResp = `Invalid Username, user not found`;
            console.log(`Error: ${errResp}`);
            return res.render('login', {msg: `${errResp}`});
        }

        if(await PasswordService.comparePassword(pass, findExistingUname.password)){
            let userToken = await TokenService.createJwtToken({
                username: uName,
                time: Date()
            });
            return res.cookie('token', userToken, { maxAge: 60 * 60 * 1000 }).redirect(`/game`);
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

            let findExistingUname = await DatabaseService.findUserByUsername(uName);

            if(findExistingUname){
                let errResp = `Username already found`;
                console.log(`Error: ${errResp}`);
                return res.render('register', {msg: `${errResp}`});
            }

            let userToken = await TokenService.createJwtToken({
                username: uName,
                time: Date()
            });
            if(!userToken){
                let errResp = `Something went wrong in token creation`;
                console.log(`Error: ${errResp}`);
                return res.render('error');
            }

            await DatabaseService.registerNewUser({
                username: uName,
                password: await PasswordService.hashPassword(pass)
            });

            return res.cookie('token', userToken, { maxAge: 60 * 60 * 1000 }).redirect(`/game`);
        }catch(error){
            console.log("Error: ", error);
            return res.render('error');
        }
    }

    async userLogout(req, res){
        return res.clearCookie('token').redirect('/');
    }
}

module.exports = new UserController();