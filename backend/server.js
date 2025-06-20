import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import { connectDB } from "./config/database.js";
import { userRouter } from "./routes/user/userRoutes.js";
import { adminRouter } from "./routes/admin/adminRoutes.js";
import { chatRouter } from "./routes/chat/chatRoutes.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";

dotenv.config();
connectDB();

const port = process.env.PORT || 5000;
const app = express();

// Middlewares
app.use(
  cors({
    origin: [
    "http://localhost:5173", 
    "https://auto-sphere-two.vercel.app"
  ],
    credentials: true,
  })
);
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/chat", chatRouter);

// Error handlers
app.use(notFound);
app.use(errorHandler);

// ⬇️ Create HTTP server & wrap app
const server = http.createServer(app);

// ⬇️ Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: "https://auto-sphere-two.vercel.app", 
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);

  // Join a room (conversationId)
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`📥 Socket ${socket.id} joined room: ${roomId}`);
  });

  // Handle sending message
  socket.on("sendMessage", ({ roomId, message }) => {
    // Emit message to other clients in the room
    socket.to(roomId).emit("newMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("🔌 Client disconnected:", socket.id);
  });
});

// ⬇️ Start Server
server.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
