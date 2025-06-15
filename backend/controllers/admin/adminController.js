import { v2 as cloudinary } from "cloudinary";
import handler from "express-async-handler";
import Car from "../../models/admin/carModel.js";

export const addCars = handler(async (req, res) => {
  const {
    company,
    model,
    priceStart,
    priceFinal,
    body,
    fuelOptions,
    driveTrains,
    transmission,
    colors,
    descriptions,
    spec,
  } = req.body;

  // Extract files
  const logoFile = req?.files?.logo?.[0];
  const imageFiles = req?.files?.images || [];

  const logoUrl = logoFile?.path || "";
  const imageUrls = imageFiles.map((file) => file.path);

  // Safely parse JSON fields
  let parsedFuelOptions = [],
    parsedDriveTrains = [],
    parsedTransmission = [],
    parsedColors = [],
    parsedSpec = {};
  try {
    parsedFuelOptions = JSON.parse(fuelOptions || "[]");
    parsedDriveTrains = JSON.parse(driveTrains || "[]");
    parsedTransmission = JSON.parse(transmission || "[]");
    parsedColors = JSON.parse(colors || "[]");
    parsedSpec = JSON.parse(spec || "{}");
  } catch (err) {
    console.error("❌ JSON parsing error:", err);
    return res
      .status(400)
      .json({ message: "Invalid JSON in form data", error: err.message });
  }

  // Minimal validation
  if (
    !company ||
    !model ||
    !priceStart ||
    !priceFinal ||
    !body ||
    parsedFuelOptions.length === 0 ||
    imageUrls.length === 0
  ) {
    console.warn("⚠️ Missing required fields");
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Construct new car document
  const newCar = new Car({
    company,
    model,
    price: {
      start: Number(priceStart),
      final: Number(priceFinal),
    },
    body,
    fuelOptions: parsedFuelOptions,
    driveTrains: parsedDriveTrains,
    transmission: parsedTransmission,
    colors: parsedColors,
    descriptions,
    imageUrls,
    logoUrl,
    spec: parsedSpec,
  });

  await newCar.save();

  res.status(201).json({ message: "Car added successfully", car: newCar });
});


export const getCars = handler(async (req, res) => {
  const cars = await Car.find(); 
  res.status(200).json(cars);
});

export const deleteCar = handler(async (req, res) => {
  const { id } = req.params;
  console.log("Deleting car with ID:", id);

  const car = await Car.findById(id);
  if (!car) {
    console.log("Car not found");
    return res.status(404).json({ message: "Car not found" });
  }

  // Delete images from Cloudinary
  if (car.images && car.images.length > 0) {
    for (const image of car.images) {
      try {
        // If `image` is an object with public_id, use that
        const publicId = image.public_id || image; // handle both formats
        const result = await cloudinary.uploader.destroy(publicId);
        console.log(`Deleted image ${publicId} from Cloudinary:`, result);
      } catch (err) {
        console.error(`Failed to delete image ${image} from Cloudinary:`, err.message);
      }
    }
  }

  await car.deleteOne();
  console.log("Car deleted successfully");

  res.status(200).json({ message: "Car deleted successfully" });
});