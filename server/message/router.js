const express = require("express");
const { sendMessage, getMessage } = require("./controller");
const router = express.Router();

router.post("/sendMessage", sendMessage);
router.get("/getMessages/:room", getMessage);

module.exports = router;
