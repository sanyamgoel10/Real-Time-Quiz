const { verifyJwtToken } = require('../services/encDecJwtToken.js');

class ValidateToken{
    async verifyJwt(req, res, next){
        try {
            let pageCookies = req.cookies;

            if('undefined' == typeof pageCookies.userToken || pageCookies.userToken == null || 'string' != typeof pageCookies.userToken || (pageCookies.userToken).trim() == ''){
                let errResp = `token not found in req`;
                console.log(`Error: ${errResp}`);
                return res.render('error');
            }

            let verifiedToken = await verifyJwtToken(pageCookies.userToken);
            if(!verifiedToken || 'undefined' == typeof verifiedToken.username){
                let errResp = `Invalid token in req`;
                console.log(`Error: ${errResp}`);
                return res.render('error');
            }
            req.UserNameFromToken = verifiedToken.username;
            next();
        } catch (error) {
            console.log("Error: ", error);
            return res.render('error');
        }
    }
}

module.exports = new ValidateToken();