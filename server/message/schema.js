const { Schema, model } = require("mongoose");

const messageSchema = new Schema({
  room: {
    type: Schema.Types.ObjectId,
    ref: "room",
    required: true,
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  content: {
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
