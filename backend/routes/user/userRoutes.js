import express from "express";
import {
  registerUser,
  loginUser,
} from "../../controllers/user/authController.js";
import { bookTestDrive, getAllCars, getUserInfo, getUserTestDrives, updateProfile } from "../../controllers/user/userController.js";
import {userAuth} from '../../middlewares/userAuth.js'
import { uploadProfile } from "../../middlewares/multer.js";

export const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/cars", getAllCars);
userRouter.get("/profile", userAuth, getUserInfo);
userRouter.patch(
  "/profile/update",
  userAuth,
  uploadProfile.single("profilePic"),
  updateProfile
);

userRouter.post("/book/testdrive", userAuth, bookTestDrive);

userRouter.get("/test-drives", userAuth, getUserTestDrives);