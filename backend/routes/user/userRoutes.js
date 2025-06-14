import express from "express";
import {
  registerUser,
  loginUser,
} from "../../controllers/user/authController.js";

export const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
