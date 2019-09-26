const mongoose = require("mongoose");

// SCHEMA SETUP
const PostSchema = new mongoose.Schema({
    title: String,
    description: String,
    createdAt: {type: Date, default: Date.now},
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            reef: "User"
        }
    ]
});

module.exports = mongoose.model("Post", PostSchema);