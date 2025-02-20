class GameController{
    async landingpage(req, res){
        return res.render('landingpage');
    }

    async searchGame(req, res){
        let userName = req.UserNameFromToken;
        return res.render('searchgame', {userName});
    }
}
module.exports = new GameController();