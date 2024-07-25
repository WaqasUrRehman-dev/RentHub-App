const express = require("express");
const router = express.Router();
const {
  allUsers,
  allProducts,
  deleteUser,
  delete_Product,
} = require("./controller");
const adminProtectRoute = require("../middleware/adminProtectRoute");

router.get("/allUsers", adminProtectRoute, allUsers);
router.get("/all-Products", adminProtectRoute, allProducts);

router.delete("/deleteUsers", adminProtectRoute, deleteUser);
router.delete("delete-product", adminProtectRoute, delete_Product);

module.exports = router;
