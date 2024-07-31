const express = require("express");
const router = express.Router();
const {
  allUsers,
  allProducts,
  deleteUser,
  delete_Product,
  allBookings,
  userLength,
  productLength,
} = require("./controller");
const adminProtectRoute = require("../middleware/adminProtectRoute");

router.get("/allUsers", adminProtectRoute, allUsers);
router.get("/users-length", adminProtectRoute, userLength);
router.get("/all-Products", adminProtectRoute, allProducts);
router.get("/products-length", adminProtectRoute, productLength);
router.get("/all-bookings", adminProtectRoute, allBookings);

router.delete("/deleteUsers/:id", adminProtectRoute, deleteUser);
router.delete("/delete-product/:id", adminProtectRoute, delete_Product);

module.exports = router;
