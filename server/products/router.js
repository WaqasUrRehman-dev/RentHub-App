const express = require("express");
const router = express.Router();
const {
  addProduct,
  deleteProduct,
  updateProduct,
  getProducts,
  findByName,
  findByCategory,
} = require("./controller");

router.post("/addProduct", addProduct);

router.delete("/deleteProduct", deleteProduct);

router.put("/editProduct", updateProduct);

router.get("/getProducts", getProducts);
router.get("/findByName", findByName);
router.get("/findByCategory", findByCategory);

module.exports = router;
