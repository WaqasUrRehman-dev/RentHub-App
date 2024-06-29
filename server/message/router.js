const express = require("express");
const { sendMessage, getMessage, getSidebarContact } = require("./controller");
const protectRoute = require("../middleware/protectRoute");
const router = express.Router();

router.post("/sendMessage/:id", protectRoute, sendMessage);
router.get("/getMessage/:id", protectRoute, getMessage);
router.get("/getAllContacts", protectRoute, getSidebarContact);

module.exports = router;
