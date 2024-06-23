const messageSchema = require("./schema");
const conversationSchema = require("../model/conversation");
require("dotenv").config();

const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    const { id: receiverId } = req.params;
    const senderId = req.user.id;

    let conversation = await conversationSchema.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await conversationSchema.create({
        members: [senderId, receiverId],
      });
    }

    const newMessage = new messageSchema({
      senderId,
      receiverId,
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
    const { id: userToChatId } = req.params;
    const senderId = req.user.id;

    const conversation = await conversationSchema
      .findOne({
        members: { $all: [senderId, userToChatId] },
      })
      .populate("message");

    if (!conversation) return res.status(200).json([]);

    return res.status(200).json(conversation.messages);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { sendMessage, getMessage };
