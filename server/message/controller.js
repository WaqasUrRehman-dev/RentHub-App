const messageSchema = require("./schema");
require("dotenv").config();

const sendMessage = async (req, res) => {
  const { room, sender, content } = req.body;
  if (!room || !sender || !content) {
    res.status(422).json({ message: "Required Field Missing" });
  } else {
    try {
      const newMessage = await messageSchema.create({ room, sender, content });
      res
        .status(201)
        .json({ message: "Message sent successfully", newMessage });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

const getMessage = async (req, res) => {
  const { room } = req.params;
  try {
    const message = await messageSchema
      .find({ room })
      .populate("sender", "name");
      res.status(200).json({message: "Message fetched successfully", message})
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { sendMessage, getMessage };