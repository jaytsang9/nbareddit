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
          replies: [
              {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "Reply"
              }
          ]
});

module.exports = mongoose.model("Post", PostSchema);