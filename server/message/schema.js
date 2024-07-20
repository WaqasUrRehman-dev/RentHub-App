const { Schema, model } = require("mongoose");

const messageSchema = new Schema({
  senderId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  receiverId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Message = model("message", messageSchema);
module.exports = Message;
