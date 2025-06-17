import jwt from "jsonwebtoken";

 const adminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);

      // ✅ Check if role is admin
      if (decoded.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admins only." });
      }

      req.user = decoded; // ✅ Set decoded payload to req.user
      console.log("🚀 Admin Authenticated:", req.user);

      next();
    } catch (error) {
      console.error("JWT verification failed:", error);
      res.status(401).json({ message: "Invalid token" });
    }
  } else {
    res.status(401).json({ message: "No token provided" });
  }
};

export default adminAuth