const { verifyJwtToken } = require('../services/TokenService.js');

class AuthMiddleware{
    async validateUserLogin(req, res, next){
        let pageCookies = req.cookies;
        if('undefined' == typeof pageCookies.token || pageCookies.token == null || 'string' != typeof pageCookies.token || (pageCookies.token).trim() == ''){
            let errResp = `Token not found`;
            console.log(`Error: ${errResp}`);
            return res.render('requiredlogin');
        }
        let verifiedToken = await verifyJwtToken(pageCookies.token);
        if(!verifiedToken || 'undefined' == typeof verifiedToken.username){
            let errResp = `Invalid or Expired Token`;
            console.log(`Error: ${errResp}`);
            return res.render('requiredlogin');
        }
        req.UserNameFromToken = verifiedToken.username;
        next();
    }

    async checkAlreadyLoggedIn(req, res, next){
        if('undefined' != typeof req.cookies.token && 'string' == typeof req.cookies.token && (req.cookies.token).trim() != ''){
            let verifiedToken = await verifyJwtToken(req.cookies.token);
            if(verifiedToken && 'undefined' != typeof verifiedToken.username){
                req.UserNameFromToken = verifiedToken.username;
                return res.redirect('/game');
            }
        }
        next();
    }
}

module.exports = new AuthMiddleware();