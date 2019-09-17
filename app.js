var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    flash           = require("connect-flash"),
    Post            = require("./models/post"),
    Reply           = require("./models/reply"),
    User            = require("./models/user"),
    port            = process.env.PORT || 3000;

// DB CONFIG
var url = process.env.DATABASEURL || "mongodb://localhost:27017/restful_blog_app";
mongoose.connect(url, {useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true});

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useFindAndModify: false});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// Tell app to use momentjs to timestamp posts and replies
app.locals.moment = require("moment");

// Passport config
app.use(require("express-session")({
    secret: "Bentley is the cutest!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Passes the currentUser data into every route so it drys up the code
// Use this to display username on headers or webpages, etc.
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

app.use("/", indexRoutes);
app.use("/posts", postRoutes);
app.use("/posts/:id/comments", commentRoutes);

app.listen(port, function(){
    console.log("App is starting!!!");
});