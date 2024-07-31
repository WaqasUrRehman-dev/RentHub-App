const express = require("express");
const router = express.Router();
const {
  addProduct,
  deleteProduct,
  updateProduct,
  allProducts,
  yourPost,
  searchProduct,
} = require("./controller");
const protectRoute = require("../middleware/protectRoute");

router.post("/addProduct", protectRoute, addProduct);
router.delete("/deleteProduct/:id", protectRoute, deleteProduct);
router.put("/editProduct", protectRoute, updateProduct);
router.get("/yourPost", protectRoute, yourPost);
router.get("/allProducts", allProducts);
router.get("/searchProduct", searchProduct);

module.exports = router;
