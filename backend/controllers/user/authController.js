import handler from "express-async-handler";
import bcrypt from "bcryptjs";
import User from "../../models/user/userModel.js";
import { generateToken } from "../../utils/generateToken.js";

// REGISTER
export const registerUser = handler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(409);
    throw new Error("This email is already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    isGoogleUser: false,
  });

  if (user) {
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || "",
        location: user.location || { state: "", district: "", pin: "" },
        profilePic: user.profilePic?.url || "",
        token: generateToken(user._id),
      },
    });
  } else {
    res.status(500);
    throw new Error("User registration failed");
  }
});

// LOGIN
export const loginUser = handler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(401);
    throw new Error("No user exists with this email");
  }

  if (user.isGoogleUser) {
    res.status(403);
    throw new Error("Please login using Google");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  res.status(200).json({
    success: true,
    message: "Login successful",
    user: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || "",
      location: user.location || { state: "", district: "", pin: "" },
      profilePic: user.profilePic?.url || "",
      token: generateToken(user._id),
    },
  });
});

// GOOGLE LOGIN
export const googleLogin = handler(async (req, res) => {
  const { email, name, picture } = req.body;

  if (!email || !name || !picture) {
    res.status(400);
    throw new Error("Invalid Google login payload");
  }

  let user = await User.findOne({ email });

  if (!user) {
    // New Google user: split name to first & last
    const [firstName, ...last] = name.split(" ");
    const lastName = last.join(" ") || "GoogleUser";

    user = await User.create({
      firstName,
      lastName,
      email,
      password: await bcrypt.hash(Date.now().toString(), 10), // just to satisfy model
      isGoogleUser: true,
      profilePic: { url: picture },
    });
  }

  res.status(200).json({
    success: true,
    message: "Google login successful",
    user: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || "",
      location: user.location || { state: "", district: "", pin: "" },
      profilePic: user.profilePic?.url || "",
      token: generateToken(user._id),
    },
  });
});

// RESET PASSWORD
export const resetPassword = handler(async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const user = await User.findById(id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.isGoogleUser) {
    res.status(403);
    throw new Error("Google users cannot change password");
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Current password is incorrect");
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
});
