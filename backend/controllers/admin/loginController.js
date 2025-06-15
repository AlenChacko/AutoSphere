import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign({ role: "admin" }, process.env.ADMIN_JWT_SECRET, {
      expiresIn: "30d",
    });
    return res.status(200).json({ token });
  }

  return res.status(401).json({ message: "Invalid admin credentials" });
});
