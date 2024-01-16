const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    fromUserId: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    isDeletetForMe: {
      type: Boolean,
      require: true,
      default: false,
    },
    isDeletetForEveryOne: {
      type: Boolean,
      require: true,
      default: false,
    },
  },
  { timestamps: true }
);
const chatModel = mongoose.model("chats", chatSchema);
module.exports = chatModel;
