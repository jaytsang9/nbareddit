const express    = require("express"),
      router     = express.Router({mergeParams: true}),
      Post       = require("../models/post"),
      Comment    = require("../models/comment"),
      middleware = require("../middleware");


// INDEX ROUTE
router.get("/", (req, res) =>{
    // Get all posts from database
    Post.find({}, (err, allPosts) => {
        if(err){
            console.log(err);
        } else {
            res.render("posts/index", {posts:allPosts});
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
            res.redirect("/posts/" + post._id);
        }
    });
});

// SHOW ROUTE - show more info about one post
router.get("/:id", (req, res) => {
    // find the post with provided ID
    Post.findById(req.params.id).populate("comments likes").exec((err, foundPost) => {
        if (err || !foundPost){
            req.flash("error", "Post not found");
            res.redirect("back");
        } else {
            console.log(foundPost);
            res.render("posts/show", {post: foundPost});
        }
    });
});

// LIKE ROUTE
router.post("/:id/like", middleware.isLoggedIn, (req, res) => {
    Post.findById(req.params.id, (err, foundPost) => {
        if (err) {
            req.flash("error", "Couldn't find post.");
            return res.redirect("/posts");
        }

        // check if req.user._id exists in foundPost.likes
        let foundUserLike = foundPost.likes.some((like) => {
            return like.equals(req.user._id);
        });

        if (foundUserLike) {
            // user already liked, removing like
            foundPost.likes.pull(req.user._id);
        } else {
            // adding the new user like
            foundPost.likes.push(req.user);
        }

        foundPost.save((err) => {
            if (err) {
                console.log(err);
                return res.redirect("/posts");
            }
            return res.redirect("/posts/" + foundPost._id);
        });
    });
});

// EDIT POST ROUTE
router.get("/:id/edit", middleware.checkPostOwnership, (req, res) => {
    Post.findById(req.params.id, (err, foundPost) => {
        res.render("posts/edit", {post: foundPost});
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
    Post.findByIdAndRemove(req.params.id, (err, postRemoved) =>{
        if(err){
            res.redirect("/posts");
        } else {
            Comment.deleteMany({_id: { $in: postRemoved.comments}}, (err) =>{
                if (err){
                    console.log(err);
                }
                res.redirect("/posts");
            });
        }
    })
});

module.exports = router;