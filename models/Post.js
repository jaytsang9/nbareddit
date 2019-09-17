const mongoose = require("mongoose"),
      PostSchema = new mongoose.Schema({
          title: String,
          description: String,
          createdAt: {
              type: Date,
              default: Date.now
          }
          author: {
              id: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "User"
              }
          },
          comments: [
              {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "Comment"
              }
          ]
});

module.exports = mongoose.model("Post", PostSchema);