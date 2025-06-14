import handler from "express-async-handler";
import bcrypt from "bcryptjs";

import User from "../../models/user/userModel.js";
import { generateToken } from "../../utils/generateToken.js";

export const registerUser = handler(async (req, res) => {

  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const existingUser = await User.findOne({ email });
  
  if (existingUser) {
    res.status(409);
    throw new Error("This email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
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
        token: generateToken(user._id),
      },
    });
  } else {
    res.status(500);
    throw new Error("User registration failed");
  }
});

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

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  const userObj = user.toObject();
  delete userObj.password;

  res.status(200).json({
    success: true,
    message: "Login successful",
    user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        token: generateToken(user._id),
      },
  });
});

