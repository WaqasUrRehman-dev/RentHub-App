const userSchema = require("../Users/schema");
const productSchema = require("../products/schema");

const allUsers = async (req, res) => {
  const admin = req.user.id;

  if (!admin) {
    return res.status(400).json({ message: "No Admin Found" });
  }
  try {
    const all_users = await userSchema
      .find({ role: { $ne: "admin" } })
      .select("-password");
    return res.status(200).json({ message: "All Users", all_users });
  } catch (error) {
    return res.status(500).json("Internal server error");
  }
};

const deleteUser = async (req, res) => {
  const name = req.params;
  try {
    const user = await userSchema.findOneAndDelete({ name });
    return res.status(200).json("User deleted Succesfully", user);
  } catch (error) {
    return res.status(500).json("Internal server error");
  }
};

const allProducts = async (req, res) => {
  try {
    const products = await productSchema.find();
    return res.status(200).json({ message: "All Products", products });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { allUsers, allProducts, deleteUser };
