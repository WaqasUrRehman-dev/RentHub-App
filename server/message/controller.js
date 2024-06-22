const messageSchema = require("./schema");
const conversationSchema = require("../model/conversation");
require("dotenv").config();

const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    console.log(message);

    const { id: receiverId } = req.params;
    const senderId = req.user.id;

    let conversation = await conversationSchema.findOne({
      members: { $all: [senderId, receiverId] },
    });
    console.log(conversation);

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
    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error to sendMessage route: ", error.message);
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

    console.log(conversation);

    if (!conversation) return res.status(200).json([]);

    return res.status(200).json(conversation.messages);
  } catch (error) {
    console.log("Error to getMessages route: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { sendMessage, getMessage };
