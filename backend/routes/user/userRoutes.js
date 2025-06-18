import express from "express";
import {
  registerUser,
  loginUser,
} from "../../controllers/user/authController.js";
import {
  addUsedCar,
  bookTestDrive,
  getAllCars,
  getMyUsedCars,
  getUserInfo,
  getUserTestDrives,
  updateProfile,
} from "../../controllers/user/userController.js";
import { userAuth } from "../../middlewares/userAuth.js";
import { uploadProfile, uploadUsedCar } from "../../middlewares/multer.js";

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
userRouter.get("/testdrives", userAuth, getUserTestDrives);
userRouter.post(
  "/add-used-car",
  userAuth,
  uploadUsedCar.array("images", 5),
  addUsedCar
);
userRouter.get("/my-used-cars", userAuth, getMyUsedCars);
