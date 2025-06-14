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


  // File uploads
  const logoFile = req.files?.logo?.[0];
  const imageFiles = req.files?.images || [];



  // Cloudinary/multer should provide 'path'
  const logoUrl = logoFile?.path || "";
  const imageUrls = imageFiles.map((file) => file.path);

  // Parse all expected JSON fields
  const parsedFuelOptions = JSON.parse(fuelOptions || "[]");
  const parsedDriveTrains = JSON.parse(driveTrains || "[]");
  const parsedTransmission = JSON.parse(transmission || "[]");
  const parsedColors = JSON.parse(colors || "[]");
  const parsedSpec = JSON.parse(spec || "{}");

  // Validate required fields minimally
  if (
    !company ||
    !model ||
    !priceStart ||
    !priceFinal ||
    !body ||
    parsedFuelOptions.length === 0 ||
    imageUrls.length === 0
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Create new Car
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
    spec: parsedSpec, // Map format supported
  });

  await newCar.save();

  res.status(201).json({ message: "Car added successfully", car: newCar });
});


