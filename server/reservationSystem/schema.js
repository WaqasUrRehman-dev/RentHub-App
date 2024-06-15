const { Schema, model } = require("mongoose");

const bookingSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["notBooked", "booked"],
      default: "notBooked",
    },
  },
  { timestamps: true }
);

const Booking = model("booking", bookingSchema);
module.exports = Booking;