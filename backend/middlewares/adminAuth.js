// middleware/adminAuth.js
import jwt from "jsonwebtoken";

export const adminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check for the Authorization header and token format
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Not an admin" });
    }

    // Attach decoded info to request if needed later
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
