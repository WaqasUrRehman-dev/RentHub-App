const jwt = require("jsonwebtoken");

const generateToken = (userId, res) => {

    console.log("generateToken", generateToken)
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 15 * 24 * 60 * 60 * 1000,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production" ? true : false,
  });
};

module.exports = generateToken;
