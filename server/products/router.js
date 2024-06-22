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

router.delete("/deleteProduct", deleteProduct);

router.put("/editProduct", updateProduct);

router.post("/yourPost", protectRoute, yourPost);
router.get("/allProducts", allProducts);
router.get("/searchProduct", searchProduct);
// router.get("/findByCategory", findByCategory);
// router.get("/findByLocation", findByLocation);

module.exports = router;
