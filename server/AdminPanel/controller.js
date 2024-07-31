const userSchema = require("../Users/schema");
const productSchema = require("../products/schema");
const bookingSchema = require("../reservationSystem/schema");

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

const userLength = async (req, res) => {
  const admin = req.user.id;

  if (!admin) {
    return res.status(400).json({ message: "No Admin Found" });
  }
  try {
    const all_users = await userSchema.find({ role: { $ne: "admin" } });
    const usersLength = all_users.length;
    return res.status(200).json({ message: "Total Users", usersLength });
  } catch (error) {
    return res.status(500).json("Internal server error");
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const user = await userSchema.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User deleted successfully", user });
    const allUsers = await userSchema.find();
    return res.status(200).json({ message: "All Users", allUsers });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const allProducts = async (req, res) => {
  try {
    const admin = req.user.id;
    if (!admin) {
      return res.status(400).json({ message: "No Admin Found" });
    }
    const products = await productSchema.find();

    const produnclength = products.length;
    return res
      .status(200)
      .json({ message: "All Products", products, produnclength });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const productLength = async (req, res) => {
  try {
    const admin = req.user.id;
    if (!admin) {
      return res.status(400).json({ message: "No Admin Found" });
    }
    const products = await productSchema.find();
    const productsLength = products.length;
    return res.status(200).json({ message: "Total Products", productsLength });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const delete_Product = async (req, res) => {
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ message: "ProductID is required" });
  }
  try {
    const product = await productSchema.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const allProducts = await productSchema.find();
    const createdBy = product.createdBy;
    return res.status(200).json({
      message: "Product deleted successfully",
      products: allProducts,
      createdBy: createdBy,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const allBookings = async (req, res) => {
  try {
    const totalBookings = await bookingSchema.find();
    res.status(200).json(totalBookings);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  allUsers,
  allProducts,
  deleteUser,
  delete_Product,
  allBookings,
  userLength,
  productLength,
};
