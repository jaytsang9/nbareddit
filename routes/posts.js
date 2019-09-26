const express    = require("express"),
      router     = express.Router({mergeParams: true}),
      Post       = require("../models/post"),
      Comment    = require("../models/comment"),
      middleware = require("../middleware");


// INDEX ROUTE
router.get("/", (req, res) =>{
    // Get all posts from database
    Post.find({}, (err, posts) => {
        if(err){
            console.log(err);
        } else {
            res.render("posts/index", {posts:posts});
        }
    });
});

// NEW ROUTE
router.get("/new", middleware.isLoggedIn, (req, res) =>{
    res.render("posts/new");
});

// CREATE ROUTE
router.post("/", middleware.isLoggedIn, (req, res) => {
    req.body.post.description = req.sanitize(req.body.post.description);
    req.body.post.author = {id: req.user._id, username:req.user.username};
    Post.create(req.body.post, (err, post) => {
        if(err){
            req.flash("error", "Could not create post.");
            res.redirect("/posts");
        } else {
            console.log(post);
            res.redirect("/posts/" + post._id);
        }
    });
});

// SHOW ROUTE - show more info about one post
router.get("/:id", (req, res) => {
    // find the post with provided ID
    Post.findById(req.params.id).populate("comments likes").exec((err, post) => {
        if (err || !post){
            req.flash("error", "Post not found");
            res.redirect("back");
        } else {
            console.log(post);
            res.render("posts/show", {post: post});
        }
    });
});

// LIKE ROUTE
router.post("/:id/like", middleware.isLoggedIn, (req, res) => {
    Post.findById(req.params.id, (err, post) => {
        if (err) {
            req.flash("error", "Couldn't find post.");
            return res.redirect("/posts");
        }

        // check if req.user._id exists in post.likes
        let foundUserLike = post.likes.some((like) => {
            return like.equals(req.user._id);
        });

        if (foundUserLike) {
            // user already liked, removing like
            post.likes.pull(req.user._id);
        } else {
            // adding the new user like
            post.likes.push(req.user);
        }

        post.save((err) => {
            if (err) {
                console.log(err);
                return res.redirect("/posts");
            }
            return res.redirect("/posts/" + post._id);
        });
    });
});

// EDIT POST ROUTE
router.get("/:id/edit", middleware.checkPostOwnership, (req, res) => {
    Post.findById(req.params.id, (err, post) => {
        res.render("posts/edit", {post: post});
    });
});

// UPDATE POST ROUTE
router.put("/:id", middleware.checkPostOwnership, (req, res) => {
    req.body.post.description = req.sanitize(req.body.post.description);
    // find and update the correct post
    Post.findByIdAndUpdate(req.params.id, req.body.post, (err, updatedPost) => {
        if (err || !updatedPost) {
            req.flash("error", "Post not found.")
            res.redirect("/posts");
        } else {
            res.redirect("/posts/" + req.params.id);
        }
    });
});

// DESTROY POST ROUTE
router.delete("/:id", middleware.checkPostOwnership, (req, res) =>{
    Post.findByIdAndRemove(req.params.id, (err, post) =>{
        if(err){
            res.redirect("/posts");
        } else {
            Comment.deleteMany({_id: {$in: post.comments}}, (err) =>{
                if (err){
                    console.log(err);
                }
                res.redirect("/posts");
            });
        }
    })
});

module.exports = router;