import handler from "express-async-handler";
import Conversation from "../../models/chat/conversationModel.js";;
import Message from "../../models/chat/messageModel.js";
import mongoose from "mongoose";

// 1. Start or Get Conversation for an Ad
export const startConversation = handler(async (req, res) => {
  const { sellerId, adId } = req.body;
  const userId = req.user._id;

  // Check if conversation exists
  let convo = await Conversation.findOne({
    participants: { $all: [userId, sellerId] },
    ad: adId,
  });

  if (!convo) {
    convo = await Conversation.create({
      participants: [userId, sellerId],
      ad: adId,
    });
  }

  res.status(200).json({ success: true, conversation: convo });
});

// 2. Get All Conversations for User
export const getUserConversations = handler(async (req, res) => {
  const userId = req.user._id;

  const conversations = await Conversation.find({
    participants: userId,
  })
    .populate("ad")
    .populate("participants", "firstName lastName profilePic email")
    .sort({ updatedAt: -1 });

  // Attach unread count to each conversation
  const updatedConversations = await Promise.all(
    conversations.map(async (convo) => {
      const unreadCount = await Message.countDocuments({
        conversation: convo._id,
        sender: { $ne: userId },
        isRead: false,
      });

      return {
        ...convo.toObject(),
        unreadCount,
      };
    })
  );

  // Count total unread messages for navbar badge
  const totalUnread = updatedConversations.reduce(
    (acc, convo) => acc + convo.unreadCount,
    0
  );

  res.status(200).json({
    success: true,
    conversations: updatedConversations,
    unreadTotal: totalUnread,
  });
});

// 3. Send Message
export const sendMessage = handler(async (req, res) => {
  const { conversationId, text, image } = req.body;
  const senderId = req.user._id;

  const message = await Message.create({
    conversation: new mongoose.Types.ObjectId(conversationId),
    sender: senderId,
    text,
    image,
  });

  // Update lastMessage in the conversation
  await Conversation.findByIdAndUpdate(conversationId, {
    updatedAt: Date.now(),
    lastMessage: {
      text: text || "",
      image: image || "",
      sender: senderId,
      createdAt: message.createdAt,
    },
  });

  res.status(201).json({ success: true, message });
});

// 4. Get Messages for a Conversation
export const getMessages = handler(async (req, res) => {
  const { id } = req.params; // conversation ID
  const userId = req.user._id;

  // Mark all unread messages not sent by the current user as read
  await Message.updateMany(
    {
      conversation: id,
      sender: { $ne: userId },
      isRead: false,
    },
    { $set: { isRead: true } }
  );

  const messages = await Message.find({ conversation: id })
    .populate("sender", "firstName lastName profilePic")
    .sort("createdAt");

  res.status(200).json({ success: true, messages });
});

export const getConversationById = handler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.id)
    .populate("ad")
    .populate("participants", "firstName lastName profilePic email");

  if (!conversation) {
    return res.status(404).json({ message: "Conversation not found" });
  }

  res.status(200).json({ success: true, conversation });
});
