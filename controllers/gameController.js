class GameController{
    async landingpage(req, res){
        let userName = req.UserNameFromToken;
        console.log("userName: ", userName);
        
        return res.render('landingpage');
    }
}
module.exports = new GameController();