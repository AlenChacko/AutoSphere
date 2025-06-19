import express from "express";

import {
  startConversation,
  getUserConversations,
  sendMessage,
  getMessages,
  getConversationById,
} from "../../controllers/chat/chatController.js";

import { userAuth } from "../../middlewares/userAuth.js";

export const chatRouter = express.Router();

chatRouter.post("/start", userAuth, startConversation);

// 📌 Get all conversations of the current user
chatRouter.get("/", userAuth, getUserConversations);

// 📌 Send a message to a conversation
chatRouter.post("/message", userAuth, sendMessage);

// 📌 Get all messages in a conversation
chatRouter.get("/message/:id", userAuth, getMessages);

// to get specific chat
chatRouter.get("/conversations/:id", userAuth, getConversationById);
