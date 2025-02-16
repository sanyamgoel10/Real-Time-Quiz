const User = require("../services/models/user.js");

class LoginController{
    async homepage(req, res){
        return res.redirect('/login');
    }

    async loginPage(req, res){
        return res.render('login');
    }

    async userLogin(req, res){
        console.log("Login: ", req.body);
        return res.render('landingpage');
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

            const newUser = new User({
                username: uName,
                password: pass
            });
            await newUser.save();

            return res.render('landingpage');
        }catch(error){
            console.log("Error: ", error);
            return res.render('error');
        }
    }
}

module.exports = new LoginController();