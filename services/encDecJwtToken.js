const config = require("../config/config.js");
const jwt = require('jsonwebtoken');

class TokenService {
    async createNewToken(data) {
        try{
            if('undefined' == typeof config.JWT_SECRET_KEY){
                return false;   
            }
            let jwtSecretKey = config.JWT_SECRET_KEY;
            const token = jwt.sign(data, jwtSecretKey, { expiresIn: '1m' });
            return token;
        }catch(error){
            console.log(`Error: ${error}`);
            return false;
        }
    }

    async verifyJwtToken(token) {
        try{
            let jwtSecretKey = config.JWT_SECRET_KEY;
            let verified = jwt.verify(token, jwtSecretKey);
            if('undefined' != typeof verified && verified != null && 'object' == typeof verified){
                return verified;
            }
            return false;
        }catch(error){
            console.log(`Error: ${error}`);
            return false
        }
    }
}

module.exports = new TokenService();