import handler from "express-async-handler";
import Car from "../../models/admin/carModel.js";

export const getAllCars = handler(async (req, res) => {
  const cars = await Car.find();
  res.status(200).json(cars);
});
