const { Schema, model } = require("mongoose");

const tokenSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  token: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 500,
  },
});

const Token = model("token", tokenSchema);
module.exports = Token;
