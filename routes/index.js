const express = require("express"),
      router = express.Router({mergeParams: true}),
      Post = require("../models/post"),
      Comment = require("../models/comment"),
      passport = require("passport"),
      User = require("../models/user");

router.get("/", (req, res) => {
    res.render("landing");
});

router.get("/register", (req, res) => {
    res.render("register");
})

router.post("/register", (req, res) =>{
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("success", "Welcome to CourtVision, " + user.username + "!");
            res.redirect("/posts");
        });
    });
});

router.get("/login", (req, res) =>{
    res.render("login");
});

router.post("/login", passport.authenticate("local", 
    { 
        successRedirect: "/posts",
        failureRedirect: "/login"
    }), (req, res) => {
});

// Logout Route
router.get("/logout", (req, res) =>{
    req.logout();
    req.flash("success", "Successfully Logged Out.");
    res.redirect("/posts");
});

module.exports = router;