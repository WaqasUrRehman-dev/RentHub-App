const { Schema, model } = require("mongoose");

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  images: [
    {
      type: String,
      reqiuired: true,
      description: "Front View",
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
    {
      type: String,
      reqiuired: true,
      description: "Back View",
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
    {
      type: String,
      reqiuired: true,
      description: "Side View",
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
    {
      type: String,
      reqiuired: true,
      description: "Side View",
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Product = model("product", productSchema);
module.exports = Product;
