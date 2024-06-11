const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      contactNo: user.contactNo,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "15d",
    }
  );
  return token;
};

module.exports = generateToken;
