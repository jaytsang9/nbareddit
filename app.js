const express          = require("express"),
      app              = express(),
      bodyParser       = require("body-parser"),
      expressSanitizer = require("express-sanitizer"),
      mongoose         = require("mongoose"),
      passport         = require("passport"),
      LocalStrategy    = require("passport-local"),
      methodOverride   = require("method-override"),
      flash            = require("connect-flash"),
      Post             = require("./models/post"),
      Comment          = require("./models/comment"),
      User             = require("./models/user"),
      commentRoutes    = require("./routes/comments"),
      postRoutes       = require("./routes/posts"),
      indexRoutes      = require("./routes/index"),
      dashboardRoutes  = require("./routes/dashboard"),
      port             = process.env.PORT || 3000,
      url              = process.env.DATABASEURL || "mongodb://localhost:27017/nba_app";

mongoose.connect(url, {useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology:true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.use(expressSanitizer());

//require moment and add to app.locals
app.locals.moment = require('moment');

// Passport config
app.use(require("express-session")({
    secret: "Bentley is the cutest dog!",
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
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

app.use((req, res, next) => {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});

app.use("/", indexRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/posts", postRoutes);
app.use("/posts/:id/comments", commentRoutes);

app.listen(port, () => {
    console.log("App is starting!!!");
});