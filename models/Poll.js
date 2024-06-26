const mongoose = require("mongoose")

const pollSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  poll: {
    type: String,
    required: true,
  },
  yes: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  no: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  skip: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  option1:{
    name:{ type: String },
    users: [],
    votes:{ type: Number },
  },
  option2:{
    name:{ type: String },
    users: [],
    votes:{ type: Number },
  },
  option3:{
    name:{ type: String },
    users: [],
    votes:{ type: Number },
  },
  option4:{
    name:{ type: String },
    users: [],
    votes:{ type: Number },
  },
  option5:{
    name:{ type: String },
    users: [],
    votes:{ type: Number },
  },
  option6:{
    name:{ type: String },
    users: [],
    votes:{ type: Number },
  },
  
})

module.exports = mongoose.model("Poll", pollSchema)
