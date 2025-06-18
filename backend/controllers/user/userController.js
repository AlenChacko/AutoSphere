import handler from "express-async-handler";
import Car from "../../models/admin/carModel.js";
import User from "../../models/user/userModel.js";
import TestDriveBooking from "../../models/user/testdriveModel.js";

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

export const updateProfile = handler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const { firstName, lastName, email, phone, state, district, pin } = req.body;

  // Update basic fields
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (email) user.email = email;
  if (phone) user.phone = phone;

  // Update location if provided
  user.location = {
    state: state || user.location?.state || "",
    district: district || user.location?.district || "",
    pin: pin || user.location?.pin || "",
  };

  // Update profile image if uploaded
  if (req.file && req.file.path) {
    user.profilePic = req.file.path; // multer-storage-cloudinary attaches `path`
  }

  const updatedUser = await user.save();

  res.status(200).json({
    _id: updatedUser._id,
    firstName: updatedUser.firstName,
    lastName: updatedUser.lastName,
    email: updatedUser.email,
    phone: updatedUser.phone,
    location: updatedUser.location,
    profilePic: updatedUser.profilePic,
  });
});

export const bookTestDrive = handler(async (req, res) => {
  const userId = req.user._id;
  const {
    car,
    firstName,
    lastName,
    email,
    phone,
    location,
    preferredDate,
  } = req.body;

  // Validation
  if (
    !car ||
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !location?.state ||
    !location?.district ||
    !location?.pin ||
    !preferredDate
  ) {
    res.status(400);
    throw new Error("All fields are required");
  }

  // Check if car exists
  const carExists = await Car.findById(car);
  if (!carExists) {
    res.status(404);
    throw new Error("Car not found");
  }

  // Create booking
  const booking = await TestDriveBooking.create({
    user: userId,
    car,
    firstName,
    lastName,
    email,
    phone,
    location,
    preferredDate,
  });

  // ⬇️ NEW: Push booking to user's testDrives array
  await User.findByIdAndUpdate(userId, {
    $push: { testDrives: booking._id },
  });

  res.status(201).json({
    message: "Test drive booked successfully",
    booking,
  });
});

export const getUserTestDrives = handler(async (req, res) => {
  console.log("Authenticated user:", req.user); // ✅ Add this line

  const userId = req.user._id;

  const testDrives = await TestDriveBooking.find({ user: userId }).sort({
    createdAt: -1,
  });

  res.status(200).json(testDrives);
});
