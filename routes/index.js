const express = require("express"),
      router  = express.Router({mergeParams:true}),
      passport = require("passport");

router.get("/", (req, res) => {
    res.render("landing");
});

// ====================
// Auth Routes
// ====================
// register form route
router.get("/register", (req, res) => {
    res.render("register");
})

// handle register logic
router.post("/register", (req, res) => {
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("success", "Welcome to PlayerApp " + user.username);
            res.redirect("/players");
        });
    });
});

// login form route
router.get("/login", (req, res) =>{
    res.render("login");
});

// handling login logic
router.post("/login", passport.authenticate("local", 
    { 
        successRedirect: "/players",
        failureRedirect: "/login"
    }), (req, res) => {
});

// Logout Route
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Successfully Logged Out.");
    res.redirect("/players");
});

module.exports = router;