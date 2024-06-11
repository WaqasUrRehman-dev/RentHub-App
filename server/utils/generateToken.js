const jwt = require("jsonwebtoken");

const generateToken = (user, res) => {
  const token = jwt.sign(
    {id: user.id, name: user.name, email: user.email, role: user.role},
    process.env.JWT_SECRET,
    {
      expiresIn: "15d",
    }
  );
  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 15 * 24 * 60 * 60 * 1000,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production" ? true : false,
  });
};

module.exports = generateToken;
