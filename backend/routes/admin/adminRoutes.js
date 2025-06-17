import express from "express";
import { loginAdmin } from "../../controllers/admin/loginController.js";
import {
  addCars,
  deleteCar,
  getAllTestDrives,
  getCarById,
  getCars,
  updateCar,
} from "../../controllers/admin/adminController.js";
import { uploadCar } from "../../middlewares/multer.js";
import adminAuth from "../../middlewares/adminAuth.js";

export const adminRouter = express.Router();

adminRouter.post("/login", loginAdmin);

adminRouter.post(
  "/add-cars",
  adminAuth,
  uploadCar.fields([
    { name: "logo", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  addCars
);

adminRouter.get("/cars", adminAuth, getCars);

adminRouter.delete("/delete-car/:id", adminAuth, deleteCar);

adminRouter.get("/car/:id", adminAuth, getCarById);

adminRouter.put(
  "/update-car/:id",
  adminAuth,
  uploadCar.fields([
    { name: "logo", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  updateCar
);

adminRouter.get("/test-drives", adminAuth, getAllTestDrives);
