const messageSchema = require("./schema");
const conversationSchema = require("../model/conversation");
const { mongoose } = require("mongoose");
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
  const { userToChatId: id } = req.query;

  const senderId = req.user.id;
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
    const senderDetails = await messageSchema.aggregate([
      {
        $match: {
          $or: [
            { receiverId: new mongoose.Types.ObjectId(userId) },
            { senderId: new mongoose.Types.ObjectId(userId) },
          ],
        },
      },
      { $sort: { timestamp: 1 } },
      {
        $group: {
          _id: {
            senderId: {
              $cond: {
                if: {
                  $eq: ["$senderId", new mongoose.Types.ObjectId(userId)],
                },
                then: "$receiverId",
                else: "$senderId",
              },
            },
            receiverId: {
              $cond: {
                if: {
                  $eq: ["$senderId", new mongoose.Types.ObjectId(userId)],
                },
                then: "$senderId",
                else: "$receiverId",
              },
            },
          },
          lastMessage: { $last: "$message" },
          lastTimestamp: { $last: "$timestamp" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id.senderId",
          foreignField: "_id",
          as: "senderDetails",
        },
      },
      { $unwind: "$senderDetails" },
      {
        $project: {
          _id: 0,
          senderId: "$_id.senderId",
          receiverId: "$_id.receiverId",

          lastMessage: 1,
          lastTimestamp: 1,
          "senderDetails.name": 1,
          "senderDetails.profilePic": 1,
        },
      },
    ]);

    return res.status(200).json({ message: senderDetails });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  sendMessage,
  getMessage,
  getSidebarContact,
};
