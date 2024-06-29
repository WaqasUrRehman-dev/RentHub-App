const messageSchema = require("./schema");
const conversationSchema = require("../model/conversation");
require("dotenv").config();

const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { receiverId: id } = req.query;
    const senderId = req.user.id;

    let conversation = await conversationSchema.findOne({
      members: { $all: [senderId, id] },
    });

    if (!conversation) {
      conversation = await conversationSchema.create({
        members: [senderId, id],
      });
    }

    const newMessage = new messageSchema({
      senderId,
      receiverId: id,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    await Promise.all([newMessage.save(), conversation.save()]);
    return res.status(201).json(newMessage);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getMessage = async (req, res) => {
  try {
    const { userToChatId: id } = req.query;
    const senderId = req.user.id;

    const conversation = await conversationSchema
      .find({
        members: { $all: [senderId, id] },
      })
      .populate("messages");

    if (!conversation) return res.status(200).json([]);

    return res.status(200).json(conversation);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { sendMessage, getMessage };
