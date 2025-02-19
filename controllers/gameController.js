class GameController{
    async landingpage(req, res){
        let userToken = req.params.token;
        let userName = req.UserNameFromToken;
        
        console.log("userToken: ", userToken);
        console.log("userName: ", userName);
        
        return res.render('landingpage');
    }
}
module.exports = new GameController();