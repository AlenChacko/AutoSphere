import express from "express";
import {
  registerUser,
  loginUser,
} from "../../controllers/user/authController.js";
import { getAllCars } from "../../controllers/user/userController.js";

export const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/cars", getAllCars);
