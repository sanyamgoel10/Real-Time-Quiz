const config = require("../config/config.js");
const jwt = require('jsonwebtoken');

class TokenService {
    async createNewToken(data) {
        if('undefined' == typeof config.JWT_SECRET_KEY){
            return false;   
        }
        let jwtSecretKey = config.JWT_SECRET_KEY;
        const token = jwt.sign(data, jwtSecretKey);
        return token;
    }

    async verifyJwtToken(token) {
        
    }
}

module.exports = new TokenService();