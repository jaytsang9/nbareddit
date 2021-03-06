const Post          = require("../models/post"),
      Comment       = require("../models/comment"),
      middlewareObj = {};

middlewareObj.checkPostOwnership = (req, res, next) => {
    // is user logged in?
    if (req.isAuthenticated()){
        Post.findById(req.params.id, (err, foundPost) => {
            if(err || !foundPost){
                req.flash("error", "Post not found");
                res.redirect("/posts");
            } else {
                // does user own the post?
                if(foundPost.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("back");
                }
            }
        })
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = (req, res, next) => {
    if (req.isAuthenticated()){
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if(err || !foundComment){
                req.flash("error", "Comment not found!");
                res.redirect("/posts");
            } else {
                // does user own the post?
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("back");
                }
            }
        })
    } else {
        req.flash("error", "You don't have permission to do that!");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login First!");
    res.redirect("/login");
};

module.exports = middlewareObj;