const { Schema, model } = require("mongoose");

const conversationSchema = new Schema({
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: "message",
      default: [],
    },
  ],
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Conversation = model("conversation", conversationSchema);
module.exports = Conversation;
