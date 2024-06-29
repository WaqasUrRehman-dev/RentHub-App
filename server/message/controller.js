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
    const { userToChatId: id } = req.query; // ID of the user you want to chat with
    const senderId = req.user.id; // Logged-in user ID

    const conversation = await conversationSchema
      .findOne({
        members: { $all: [senderId, id] },
      })
      .populate({
        path: "messages",
        populate: {
          path: "senderId",
          select: "name", // Fetch the sender's name
        },
      });

    if (!conversation) {
      return res.status(200).json([]); // No conversation found
    }

    return res.status(200).json(conversation.messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getSidebarContact = async (req, res) => {
  try {
    const senderId = req.user.id;

    // Find all conversations where the sender is a member
    const conversations = await conversationSchema
      .find({ members: senderId })
      .populate("members", "name");
      
    if (!conversations) {
      return res.status(200).json([]);
    }

    // Extract and filter unique members who are not the sender
    const uniqueContacts = new Set();
    conversations.forEach((conversation) => {
      conversation.members.forEach((member) => {
        if (member._id.toString() !== senderId) {
          uniqueContacts.add(member.name);
        }
      });
    });

    return res.status(200).json([...uniqueContacts]);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { sendMessage, getMessage, getSidebarContact };
