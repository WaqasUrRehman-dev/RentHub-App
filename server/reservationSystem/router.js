const express = require("express");
const router = express.Router();
const {
  createBooking,
  allBookings,
  updateBookingStatus,
  deleteBooking,
} = require("./controller");
const protectRoute = require("../middleware/protectRoute");

router.post("/createBooking", protectRoute, createBooking);
router.get("/allBookings", allBookings);
router.put("/updateBookingStatus", protectRoute, updateBookingStatus);
router.delete("/deleteBooking/:id", protectRoute, deleteBooking);

module.exports = router;
