const express    = require("express"),
      router     = express.Router({mergeParams: true}),
      Post       = require("../models/post"),
      Comment    = require("../models/comment"),
      middleware = require("../middleware");


// Comments New
router.get("/new", middleware.isLoggedIn, (req, res) => {
    // find post by id
    Post.findById(req.params.id, (err, post) => {
        if(err || !post){
            req.flash("error", "Post not found. Unable to post comment.");
            res.redirect("/posts");
        } else {
            res.render("comments/new", {post: post});
        }
    })
});

// Comments Create
router.post("/", middleware.isLoggedIn, (req, res) => {
    // lookup post using ID
    Post.findById(req.params.id, (err, post) => {
        if(err || !post){
            req.flash("error", "Post not found. Cannot create comment.");
            res.redirect("/posts");
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if(err){
                    req.flash("error", "something went wrong!");
                    res.redirect("/posts/" + post._id);
                } else {
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save();
                    post.comments.push(comment);
                    post.save();
                    req.flash("success", "Successfully added comment!");
                    res.redirect("/posts/" + post._id);
                }
            });
        }
    })
});

// EDIT ROUTE FOR COMMENT
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) =>{
    Post.findById(req.params.id, (err, foundPost) => {
        if (err || !foundPost){
            req.flash("error", "Post not found.");
            return res.redirect("/posts");
        }
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if(err){
                res.redirect("back");
            } else {
                res.render("comments/edit", {post_id: req.params.id, comment: foundComment});
            }
        })
    })
})

// COMMENT UPDATE 
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if(err || !updatedComment){
            req.flash("error", "Could not update comment.");
            res.redirect("back");
        } else {
            res.redirect("/posts/" + req.params.id);
        }
    })
});

// COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment Deleted");
            res.redirect("/posts/" + req.params.id);
        }
    });
})

module.exports = router;