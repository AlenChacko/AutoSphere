import handler from "express-async-handler";
import Car from "../../models/admin/carModel.js";
import User from "../../models/user/userModel.js";

export const getAllCars = handler(async (req, res) => {
  const cars = await Car.find();
  res.status(200).json(cars);
});

export const getUserInfo = handler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: No user found" });
  }

  const user = await User.findById(userId).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json(user);
});
