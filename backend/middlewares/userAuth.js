import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const userAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // same secret used in generateToken

    const user = await User.findById(decoded.id).select("-password"); // Optional: re-fetch full user info

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    req.user = user; // attach user object to the request
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};

export default userAuth;
