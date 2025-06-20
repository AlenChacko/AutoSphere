import express from "express";
import {
  registerUser,
  loginUser,
  resetPassword,
  googleLogin, // ✅ Import google login controller
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

// ✅ Auth
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/google-login", googleLogin); // ✅ Google login route
userRouter.put("/reset-password/:id", userAuth, resetPassword);

// ✅ Car Listings
userRouter.get("/cars", getAllCars);
userRouter.get("/used-cars", getAllUsedCars);
userRouter.get("/used-car/:id", getUsedCarById);
userRouter.post(
  "/add-used-car",
  userAuth,
  uploadUsedCar.array("images", 5),
  addUsedCar
);
userRouter.get("/my-used-cars", userAuth, getMyUsedCars);
userRouter.put(
  "/update/used-car/:id",
  userAuth,
  uploadUsedCar.array("images", 5),
  updateUsedCar
);
userRouter.patch("/mark-sold/:id", userAuth, markUsedCarAsSold);

// ✅ Profile
userRouter.get("/profile", userAuth, getUserInfo);
userRouter.patch(
  "/profile/update",
  userAuth,
  uploadProfile.single("profilePic"),
  updateProfile
);

// ✅ Test Drives
userRouter.post("/book/testdrive", userAuth, bookTestDrive);
userRouter.get("/testdrives", userAuth, getUserTestDrives);

// ✅ Wishlist
userRouter.post("/wishlist/:carId", userAuth, addToWishlist);
userRouter.delete("/wishlist/:carId", userAuth, removeFromWishlist);
userRouter.get("/wishlist", userAuth, getWishlist);
