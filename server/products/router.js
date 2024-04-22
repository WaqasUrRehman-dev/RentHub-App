const express = require("express");
const router = express.Router();
const { addProduct, deleteProduct, updateProduct, getProducts } = require("./controller");

router.post("/addProduct", addProduct);
router.post("/deleteProduct", deleteProduct);
router.post("/updateProduct", updateProduct);

router.get("/getProducts",  getProducts)

module.exports = router;
