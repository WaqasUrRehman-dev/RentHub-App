const express = require("express");
const router = express.Router();
const { allUsers, allProducts, deleteUser } = require("./controller");
const adminProtectRoute = require("../middleware/adminProtectRoute");

router.get("/allUsers", adminProtectRoute, allUsers);
router.get("/allProducts", adminProtectRoute, allProducts);

router.delete("/deleteUsers", adminProtectRoute, deleteUser);

module.exports = router;
