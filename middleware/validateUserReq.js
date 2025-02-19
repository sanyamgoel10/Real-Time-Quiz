const { verifyJwtToken } = require('../services/encDecJwtToken.js');

class ValidateToken{
    async verifyJwt(req, res, next){
        try {
            if('undefined' == typeof req.params.token || req.params.token == null || 'string' != typeof req.params.token || (req.params.token).trim() == ''){
                let errResp = `token not in request`;
                console.log(`Error: ${errResp}`);
                return res.render('error');
            }
            let verifiedToken = await verifyJwtToken(req.params.token);
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