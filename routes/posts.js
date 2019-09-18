let express = require("express"),
      router = express.Router({mergeParams:true}),
      Post = require("../models/post"),
      Comment = require("../models/comment"),
      User = require("../models/user"),
      middleware = require("../middleWare");

// Index route shows a list of all forum posts
router.get("/", (req, res) =>{
    Post.findById({}, (err, allPosts) => {
        if(err){
            console.log(err);
        } else {
            res.render("posts/index", {posts:allPosts});
        }
    })
});

// Create route is a post request to create the post in the db
router.post("/", middleware.isLoggedIn, (req, res) =>{
    // get data from form and add to campgrounds array
    let title = req.body.title,
        desc = req.body.description,
        author = {
        id: req.user._id,
        username:req.user.username
    };
    let newPost = {title: title, description: desc, author: author};
    // Create a new campground and save to DB
    Post.create(newPost, (err, newlyCreated) =>{
        if(err){
            console.log(err);
        } else {
            res.redirect("/posts");
        }
    });
});

// New route shows new post form
router.get("/new", (req, res) =>{
    res.render("posts/new");
});


// Show route shows the specified post
router.get("/:id", (req, res) => {
    Post.findById(req.params.id).populate("comments").exec((err, foundPost) => {
        if(err || !foundPost){
            req.flash("error", "Post not found!");
            res.redirect("/posts");
        } else {
            res.render("posts/show", {post: foundPost});
        }
    });
});

// Edit route shows edit form
router.get("/:id/edit", middleware.checkPostOwnership, (req, res) => {
    Post.findById(req.params.id, (err, foundPost) => {
        if(err || !foundPost){
            req.flash("error", "Post not found!");
            res.redirect("/posts");
        } else {
            res.render("posts/edit", {post:foundPost});
        }
    })
});

// Update route sends a put request to server 
router.put("/:id", middleware.checkPostOwnership, (req, res) => {
    Post.findByIdAndUpdate(req.params.id, req.body.post, (err, updatedPost) => {
        if(err || !updatedPost){
            req.flash("error", "Post not found!");
            res.redirect("/posts");
        } else {
            res.redirect("/posts/" + req.params.id);
        }
    })
});

// Delete route sends a destroy request to server
router.delete("/:id", middleware.checkPostOwnership, (req, res) => {
    Post.findByIdAndRemove(req.params.id, (err, removedPost) => {
        if(err || !removedPost){
            req.flash("error", "Post not found!");
            res.redirect("/posts");
        } else {
            Comment.deleteMany({_id: { $in: removedPost.comment}}, (err) => {
                if (err){
                    console.log(err);
                } else {
                    res.redirect("/campgrounds");
                }
            });
        }
    });
});

module.exports = router;