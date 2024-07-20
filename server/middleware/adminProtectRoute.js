const jwt = require("jsonwebtoken");
const userSchema = require("../Users/schema");
require("dotenv").config();

const adminProtectRoute = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(400).json({ message: "Unauthorized - No Token" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userSchema.findById(decoded.id);
    console.log(user)
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden - Admin Only" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

module.exports = adminProtectRoute;
