import express from "express";
import {
  registerUser,
  loginUser,
  resetPassword,
} from "../../controllers/user/authController.js";
import {
  addToWishlist,
  addUsedCar,
  bookTestDrive,
  getAllCars,
  getAllUsedCars,
  getMyUsedCars,
  getUsedCarById,
  getUserInfo,
  getUserTestDrives,
  getWishlist,
  markUsedCarAsSold,
  removeFromWishlist,
  updateProfile,
  updateUsedCar,
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
userRouter.get("/used-cars", getAllUsedCars);
userRouter.get('/used-car/:id',getUsedCarById)

userRouter.put(
  "/update/used-car/:id",
  userAuth,
  uploadUsedCar.array("images", 5), // Max 5 files
  updateUsedCar
);

userRouter.post("/wishlist/:carId", userAuth, addToWishlist);
userRouter.delete("/wishlist/:carId", userAuth, removeFromWishlist);
userRouter.get("/wishlist", userAuth, getWishlist);
userRouter.patch("/mark-sold/:id", userAuth, markUsedCarAsSold)
userRouter.put("/reset-password/:id", userAuth, resetPassword);