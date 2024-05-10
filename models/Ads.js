const mongoose = require("mongoose")

const adsSchema = new mongoose.Schema(
  {
    objType: {
      type: String,
      default: "ads",
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

module.exports = mongoose.model("Ads", adsSchema)
