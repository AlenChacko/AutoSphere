import express from "express";
import { loginAdmin } from "../../controllers/admin/loginController.js";
import { addCars } from "../../controllers/admin/adminController.js";
import upload from "../../middlewares/multer.js";

export const adminRouter = express.Router();

adminRouter.post("/login", loginAdmin);
adminRouter.post(
  "/add-cars",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  addCars
);
