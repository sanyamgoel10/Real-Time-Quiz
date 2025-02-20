class GameController{
    async landingpage(req, res){
        return res.render('landingpage');
    }

    async searchGame(req, res){
        let userName = req.UserNameFromToken;
        console.log("userName: ", userName);
        return res.render('searchgame');
    }
}
module.exports = new GameController();