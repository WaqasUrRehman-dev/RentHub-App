const express = require("express");
const router = express.Router();
const {
  addProduct,
  deleteProduct,
  updateProduct,
  findByName,
  findByCategory,
  allProducts,
} = require("./controller");

router.post("/addProduct", addProduct);

router.delete("/deleteProduct", deleteProduct);

router.put("/editProduct", updateProduct);

router.get("/allProducts", allProducts);
router.get("/findByName", findByName);
router.get("/findByCategory", findByCategory);

module.exports = router;
