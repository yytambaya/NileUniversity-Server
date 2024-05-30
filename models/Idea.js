const mongoose = require("mongoose")

const ideaSchema = new mongoose.Schema(
  {
    objType: {
      type: String,
      default: "Idea",
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true
    },
    picture: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
)

module.exports = mongoose.model("Idea", ideaSchema)
