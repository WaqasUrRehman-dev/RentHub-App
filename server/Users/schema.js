const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contactNo: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
  gender: { type: String, default: "male" },
  profilePic: { type: String, default: "" },
  address: { type: String, default: "street no 2 malir, karachi" },
});

const userModel = model("user", userSchema);
module.exports = userModel;
