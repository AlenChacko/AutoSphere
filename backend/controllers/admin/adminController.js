import { v2 as cloudinary } from "cloudinary";
import handler from "express-async-handler";
import Car from "../../models/admin/carModel.js";
import TestDriveBooking from "../../models/user/testDriveModel.js";

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

  const logoFile = req?.files?.logo?.[0];
  const imageFiles = req?.files?.images || [];

  // Upload logo to Cloudinary
  let logo = {};
  if (logoFile) {
    const result = await cloudinary.uploader.upload(logoFile.path, {
      folder: "autosphere/cars/logos",
    });
    logo = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }

  // Upload car images to Cloudinary
  const images = await Promise.all(
    imageFiles.map(async (file) => {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "autosphere/cars/gallery",
      });
      return {
        public_id: result.public_id,
        url: result.secure_url,
      };
    })
  );

  // Parse JSON fields safely
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

  // Validate required fields
  if (
    !company ||
    !model ||
    !priceStart ||
    !priceFinal ||
    !body ||
    parsedFuelOptions.length === 0 ||
    images.length === 0
  ) {
    console.warn("⚠️ Missing required fields");
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Create and save car
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
    logo, // Now an object with public_id and url
    images, // Now an array of objects with public_id and url
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
  console.log("➡️ Attempting to delete car with ID:", id);

  const car = await Car.findById(id);
  if (!car) {
    console.log("❌ Car not found in the database.");
    return res.status(404).json({ message: "Car not found" });
  }

  console.log(
    `✅ Car found: ${car.name || "Unnamed Car"}, checking for images...`
  );
  console.log("🧾 car.images =", car.images);

  // 🖼️ Delete car images
  if (car.images && car.images.length > 0) {
    console.log(
      `🖼️ Found ${car.images.length} image(s). Attempting to delete from Cloudinary...`
    );

    for (const image of car.images) {
      try {
        const publicId = typeof image === "string" ? image : image.public_id;
        if (!publicId) {
          console.warn("⚠️ Invalid image format:", image);
          continue;
        }

        console.log("🗑️ Deleting image from Cloudinary:", publicId);
        const result = await cloudinary.uploader.destroy(publicId);
        console.log(`✅ Deleted image:`, result);
      } catch (err) {
        console.error(`❌ Failed to delete image:`, err.message);
      }
    }
  }

  // 🧼 Delete logo
  if (car.logo && car.logo.public_id) {
    try {
      console.log("🗑️ Deleting logo from Cloudinary:", car.logo.public_id);
      const result = await cloudinary.uploader.destroy(car.logo.public_id);
      console.log("✅ Deleted logo:", result);
    } catch (err) {
      console.error("❌ Failed to delete logo:", err.message);
    }
  } else {
    console.log("ℹ️ No logo found to delete.");
  }

  // ❌ Delete car from DB
  await car.deleteOne();
  console.log("✅ Car deleted from database.");

  res
    .status(200)
    .json({ message: "Car, its images, and logo deleted successfully" });
});

export const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.status(200).json(car);
  } catch (error) {
    console.error("Error fetching car:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateCar = handler(async (req, res) => {
  const { id } = req.params;
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

  const car = await Car.findById(id);
  if (!car) {
    return res.status(404).json({ message: "Car not found" });
  }

  // Update basic fields
  car.company = company;
  car.model = model;
  car.price = { start: priceStart, final: priceFinal };
  car.body = body;
  car.fuelOptions = fuelOptions ? JSON.parse(fuelOptions) : [];
  car.driveTrains = driveTrains ? JSON.parse(driveTrains) : [];
  car.transmission = transmission ? JSON.parse(transmission) : [];
  car.colors = colors ? JSON.parse(colors) : [];
  car.descriptions = descriptions || "";
  car.spec = spec ? JSON.parse(spec) : [];

  // Handle logo
  const logoFile = req?.files?.logo?.[0];
  if (logoFile) {
    // delete old logo from Cloudinary
    if (car.logo?.public_id) {
      await deleteFromCloudinary(car.logo.public_id);
    }

    const logoResult = await uploadToCloudinary(logoFile.path, "car-logos");
    car.logo = { url: logoResult.secure_url, public_id: logoResult.public_id };
  }

  // Handle images
  const newImages = req?.files?.images || [];
  if (newImages.length > 0) {
    // delete old images
    for (const img of car.images) {
      if (img.public_id) await deleteFromCloudinary(img.public_id);
    }

    const uploadedImages = [];
    for (const img of newImages) {
      const result = await uploadToCloudinary(img.path, "car-images");
      uploadedImages.push({
        url: result.secure_url,
        public_id: result.public_id,
      });
    }
    car.images = uploadedImages;
  }

  await car.save();
  res.status(200).json({ message: "Car updated successfully", car });
});

export const getAllTestDrives = handler(async (req, res) => {
  const testDrives = await TestDriveBooking.find()
    .populate("user", "firstName lastName email")
    .populate("car", "company model");

  res.status(200).json(testDrives);
});

export const updateTestDriveStatus = handler(async (req, res) => {
  const { status, assignedDate } = req.body;
  const { id } = req.params;

  const booking = await TestDriveBooking.findById(id);
  if (!booking) {
    res.status(404);
    throw new Error("Test drive booking not found");
  }

  // Update only if values provided
  if (status) booking.status = status;
  if (assignedDate) booking.assignedDate = assignedDate;

  const updated = await booking.save();
  res.status(200).json({
    success: true,
    message: "Booking updated successfully",
    data: updated,
  });
});

