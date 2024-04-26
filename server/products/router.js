const express = require("express");
const router = express.Router();
const { addProduct, deleteProduct, updateProduct, getProducts } = require("./controller");

router.post("/addProduct", addProduct);

router.delete("/deleteProduct", deleteProduct);

router.put("/updateProduct", updateProduct);

router.get("/getProducts",  getProducts)

module.exports = router;
