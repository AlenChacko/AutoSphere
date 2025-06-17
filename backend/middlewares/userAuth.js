import jwt from "jsonwebtoken";
import User from "../models/user/userModel.js";



export const userAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("🔐 Authorization Header:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("⛔ No token or invalid format");
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];
  console.log("🪙 Extracted Token:", token);

  try {
    const decoded = jwt.verify(token, process.env.CLIENT_JWT_SECRET);
    console.log("✅ Decoded Token:", decoded);

    const user = await User.findById(decoded.id).select("-password");
    console.log("👤 User Fetched From DB:", user);

    if (!user) {
      console.log("⛔ User not found in DB");
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    req.user = user;
    console.log("➡️ User attached to req.user:", req.user);
    next();
  } catch (error) {
    console.error("❌ JWT Verification Error:", error.message);
    res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};

