const express = require("express");
const { sendMessage, getMessage } = require("./controller");
const protectRoute = require("../middleware/protectRoute");
const router = express.Router();

router.post("/sendMessage/:id", protectRoute, sendMessage);
router.get("/getMessage/:id", protectRoute, getMessage);

module.exports = router;
