const mongoose = require("mongoose")

const resourceSchema = new mongoose.Schema(
  {
    objType: {
      type: String,
      default: "Resource",
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      max: 50,
    },
    link: {
      type: String,
      required: true,
      trim: true,
    },
    picture: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
)

module.exports = mongoose.model("Resource", resourceSchema)
