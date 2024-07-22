const messageSchema = require("./schema");
const conversationSchema = require("../model/conversation");
require("dotenv").config();

const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { receiverId } = req.query;
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
  const { userToChatId: id } = req.query; // ID of the user you want to chat with

  const senderId = req.user.id; // Logged-in user ID
  try {
    const conversation = await conversationSchema
      .findOne({
        members: { $all: [senderId, id] },
      })
      .populate({
        path: "messages",
        populate: {
          path: "receiverId",
          select: "name timestamp messages profilePic", // Fetch the sender's name
        },
      });

    if (!conversation) {
      return res.status(200).json([]); // No conversation found
    }

    return res.status(200).json({ messages: conversation.messages });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getSidebarContact = async (req, res) => {
  try {
    const { userId } = req.query;
    const senderId = req.user.id;

    const conversations = await conversationSchema
      .find({ members: senderId })
      .populate("members", "name");

    if (!conversations) {
      return res.status(200).json([]);
    }

    const lastMessage = await messageSchema
      .findOne({
        $or: [
          { senderId: senderId, receiverId: userId },
          { senderId: userId, receiverId: senderId },
        ],
      })
      .sort({ timestamp: -1 })
      .populate("senderId receiverId")
      .select("-password");

    if (!lastMessage) {
      return res.status(404).json({ message: "No messages found" });
    }

    const otherUser =
      lastMessage.senderId._id.toString() === senderId
        ? lastMessage.receiverId
        : lastMessage.senderId;

    const utcDate = new Date(lastMessage.timestamp);
    const offset = 5 * 60; // UTC+5:00 offset in minutes
    const localTime = new Date(utcDate.getTime() + offset * 60000);

    const formattedTime = localTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const messageDetails = {
      id: otherUser._id,
      lastMessage: lastMessage.message,
      timestamp: formattedTime,
      profilePic: otherUser.profilePic,
    };

    const uniqueContacts = new Set();
    conversations.forEach((conversation) => {
      conversation.members.forEach((member) => {
        if (member._id.toString() !== senderId) {
          uniqueContacts.add(member.name);
        }
      });
    });

    return res.status(200).json([...uniqueContacts, messageDetails]);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  sendMessage,
  getMessage,
  getSidebarContact,
};
