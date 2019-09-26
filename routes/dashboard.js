const express    = require("express"),
      router     = express.Router({mergeParams:true}),
      request    = require("request"),
      keys       = ["games_played", "min", "fgm", "fga", 
                    "fg_pct", "fg3m", "fg3a",
                    "fg3_pct", "ftm", "fta",
                    "ft_pct", "oreb", "dreb",
                    "reb", "ast", "stl", "blk",
                    "turnover", "pf", "pts"],
      avgLabels  = ["GP", "MIN", "FGM", 
                    "FGA", "FG%", "FG3M",
                    "FG3A", "3PT%", "FTM", 
                    "FTA", "FT%", "OREB", 
                    "DREB", "REB", "AST",
                    "STL", "BLK", "TO",
                    "PF", "PTS"];

router.get("/", (req, res) => {
    res.render("dashboard/index");
});

router.get("/results", (req, res) => {
    let search = req.query.search;
    // request will convert a player's name to an id
    request(`https://www.balldontlie.io/api/v1/players?search=${search}`, (error, response, body) =>{
        if(!error && response.statusCode == 200){
            let player = JSON.parse(body);
            console.log(player)
            // api request gathers a specific player's season averages using the id from the last request
            request(`https://www.balldontlie.io/api/v1/season_averages?season=2018&player_ids[]=${player["data"][0]["id"]}`, (error, response, body) =>{
                let avgData = JSON.parse(body),
                    avgs = [];
                keys.forEach((key) => {
                    avgs.push(avgData["data"][0][key]);
                });
                res.render("dashboard/results", {avgData: avgData, player:player, avgLabels:avgLabels, avgs:avgs});
            });
        } else {
            req.flash("error", "Couldn't find player.");
            res.redirect("/dashboard");
        }
    });
});

module.exports = router;