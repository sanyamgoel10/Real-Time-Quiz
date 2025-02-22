const TokenService = require('../services/TokenService.js');
const DatabaseService = require('../services/DatabaseService.js');

class AuthMiddleware{
    async validateUserLogin(req, res, next){
        let pageCookies = req.cookies;
        if('undefined' == typeof pageCookies.token || pageCookies.token == null || 'string' != typeof pageCookies.token || (pageCookies.token).trim() == ''){
            let errResp = `Token not found`;
            console.log(`Error: ${errResp}`);
            return res.render('requiredlogin');
        }
        let verifiedToken = await TokenService.verifyJwtToken(pageCookies.token);
        if(!verifiedToken || 'undefined' == typeof verifiedToken.username){
            let errResp = `Invalid or Expired Token`;
            console.log(`Error: ${errResp}`);
            return res.render('requiredlogin');
        }
        if(!(await DatabaseService.validateUserName(verifiedToken.username))){
            let errResp = `Invalid username in token`;
            console.log(`Error: ${errResp}`);
            return res.render('requiredlogin');
        }
        req.UserNameFromToken = verifiedToken.username;
        next();
    }

    async checkAlreadyLoggedIn(req, res, next){
        if('undefined' != typeof req.cookies.token && 'string' == typeof req.cookies.token && (req.cookies.token).trim() != ''){
            let verifiedToken = await TokenService.verifyJwtToken(req.cookies.token);
            if(verifiedToken && verifiedToken.username && (await DatabaseService.validateUserName(verifiedToken.username))){
                req.UserNameFromToken = verifiedToken.username;
                return res.redirect('/game');
            }
        }
        next();
    }
}

module.exports = new AuthMiddleware();