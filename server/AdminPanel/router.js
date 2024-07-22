const express = require("express");
const router = express.Router();
const { allUsers, allProducts, deleteUser } = require("./controller");
const adminProtectRoute = require("../middleware/adminProtectRoute");

router.get("/all-Users", adminProtectRoute, allUsers);
router.get("/all-Products", adminProtectRoute, allProducts);

router.delete("/deleteUsers", adminProtectRoute, deleteUser);

module.exports = router;
