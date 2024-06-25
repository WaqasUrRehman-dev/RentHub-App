const bookingSchema = require("./schema");

// Create booking
const createBooking = async (req, res) => {
  const { product, startDate, endDate } = req.body;
  const user = req.user.id;
  try {
    let checkStatus = await bookingSchema.findOne({ product });

    if (checkStatus) {
      return res
        .status(400)
        .json({ message: "This Product is already booked" });
    }

    const newBooking = new bookingSchema({
      user,
      product,
      startDate,
      endDate,
      status: "booked",
    });

    await newBooking.save();
    return res.status(201).json({
      message: "Booking created successfully",
      newBooking,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get all bookings
const allBookings = async (req, res) => {
  try {
    const bookings = await bookingSchema.find().populate("product");
    return res.status(200).json(bookings);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// Update booking status
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { endDate } = req.body;
    const userId = req.user.id;

    const filter = { id };
    const update = { endDate };

    const booking = await bookingSchema.findOneAndUpdate(filter, update, {
      new: true,
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    return res
      .status(200)
      .json({ message: "Booking Updated Successfully", userId, booking });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// Delete booking
const deleteBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const booking = await bookingSchema.findOneAndDelete(req.params._id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    return res
      .status(200)
      .json({ message: "Booking deleted successfully", userId, booking });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

module.exports = {
  createBooking,
  allBookings,
  updateBookingStatus,
  deleteBooking,
};
