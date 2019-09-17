const mongoose = require("mongoose"),
      ReplySchema = new mongoose.Schema({
          text: "String",
          createdAt: {
            type: Date,
            default: Date.now
          }
          author: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            username: String
        }
      });

module.exports = mongoose.Schema("Reply", ReplySchema);