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

router.post("/addProduct", addProduct);

router.delete("/deleteProduct", deleteProduct);

router.put("/editProduct", updateProduct);

router.get("/youPost", yourPost);
router.get("/allProducts", allProducts);
router.get("/searchProduct", searchProduct);
// router.get("/findByCategory", findByCategory);
// router.get("/findByLocation", findByLocation);

module.exports = router;
