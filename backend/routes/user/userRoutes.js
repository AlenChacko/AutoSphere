import express from "express";
import {
  registerUser,
  loginUser,
} from "../../controllers/user/authController.js";
import { getAllCars, getUserInfo } from "../../controllers/user/userController.js";
import {userAuth} from '../../middlewares/userAuth.js'

export const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/cars", getAllCars);
userRouter.get("/profile", userAuth, getUserInfo);
