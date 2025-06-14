
import jwt from "jsonwebtoken";

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.CLIENT_JWT_SECRET, {
    expiresIn: "30d",
  });
};
