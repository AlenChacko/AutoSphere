import express from "express";
import { loginAdmin } from "../../controllers/admin/loginController.js";
import {
  addCars,
  deleteCar,
  getCarById,
  getCars,
  updateCar,
} from "../../controllers/admin/adminController.js";
import { uploadCar } from "../../middlewares/multer.js"; // ✅ specifically using car upload
import adminAuth from "../../middlewares/adminAuth.js";

export const adminRouter = express.Router();

// 🟢 Admin login
adminRouter.post("/login", loginAdmin);

// 🟢 Add a new car
adminRouter.post(
  "/add-cars",
  adminAuth,
  uploadCar.fields([
    { name: "logo", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  addCars
);

// 🟢 Get all cars
adminRouter.get("/cars", adminAuth, getCars);

// 🟢 Delete a car by ID
adminRouter.delete("/delete-car/:id", adminAuth, deleteCar);

// 🟢 Get a car by ID
adminRouter.get("/car/:id", adminAuth, getCarById);

// 🟢 Update car by ID
adminRouter.put(
  "/update-car/:id",
  adminAuth,
  uploadCar.fields([
    { name: "logo", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  updateCar
);
